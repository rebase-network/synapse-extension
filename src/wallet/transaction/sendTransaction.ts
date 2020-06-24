import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { ADDRESS_TYPE_CODEHASH } from '@utils/constants';
import { textToHex, textToBytesLength } from '@utils/index';
import * as _ from 'lodash';
import { getDepFromLockType } from '@utils/deps';
import { getUnspentCells } from '@utils/apis';
import { createRawTx, createAnyPayRawTx, createUpdateDataRawTx } from './txGenerator';
import { configService } from '../../config';
import { signTx } from '../addKeyperWallet';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

export const generateTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  toDataHex?,
) => {
  const unspentCells = await getUnspentCells(lockHash);
  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };

  const fromLockScript = addressToScript(fromAddress);
  const toLockScript = addressToScript(toAddress);

  const depObj = getDepFromLockType(lockType);

  const rawObj = createRawTx(
    new BN(toAmount),
    toLockScript,
    inputCells,
    fromLockScript,
    [depObj],
    new BN(fee),
    toDataHex,
  );
  const rawTransaction = rawObj.tx;

  return rawTransaction;
};

export const generateAnyPayTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  fromLockType,
  toLockType,
) => {
  const fromLockScript = addressToScript(fromAddress);
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);
  // unspentCells
  const unspentCells = await getUnspentCells(lockHash);
  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };

  // Wallet Cell
  const unspentWalletCells = await getUnspentCells(toLockHash);
  function getWalletTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const walletTotalCapity = unspentWalletCells.reduce(getWalletTotalCapity, 0);

  const depObj = getDepFromLockType(fromLockType);
  const anypayDepObj = getDepFromLockType(toLockType);

  const rawObj = createAnyPayRawTx(
    new BN(toAmount),
    toLockScript,
    inputCells,
    fromLockScript,
    [depObj, anypayDepObj],
    new BN(fee),
    unspentWalletCells,
    walletTotalCapity,
  );
  const rawTransaction = rawObj.tx;

  return rawTransaction;
};

export const generateUpdateDataTx = async (
  deps,
  fee,
  fromAddress,
  inputOutPoint: CKBComponents.OutPoint,
  lockHash,
  inputData,
) => {
  const fromLockScript = addressToScript(fromAddress);
  const dataCell = await ckb.rpc.getLiveCell(inputOutPoint, true);
  const cellDataCapacity = BigInt(dataCell.cell.output.capacity);

  const unspentCells = await getUnspentCells(lockHash);

  let inputDataHex = '';
  let inputDataLength = 0;
  let newDataCapacity = 0;
  if (_.isEmpty(inputData)) {
    inputDataHex = '0x';
  } else {
    inputDataHex = textToHex(inputData);
    inputDataLength = textToBytesLength(inputData);
    newDataCapacity = inputDataLength * 10 ** 8;
  }

  const rawObj = createUpdateDataRawTx(
    deps,
    BigInt(fee),
    fromLockScript,
    inputOutPoint,
    BigInt(cellDataCapacity),
    unspentCells,
    BigInt(newDataCapacity),
    inputDataHex,
  );
  const rawTransaction = rawObj.tx;

  return rawTransaction;
};

export const sendUpdateDataTransaction = async (
  deps,
  fee,
  fromAddress,
  inputOutPoint,
  lockHash,
  inputData,
  password,
  publicKey,
) => {
  const rawTransaction = await generateUpdateDataTx(
    deps,
    fee,
    fromAddress,
    inputOutPoint,
    lockHash,
    inputData,
  );

  const config = { index: 0, length: -1 };
  const signedTx = await signTx(lockHash, password, rawTransaction, config, publicKey);

  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  return realTxHash;
};

export const sendTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  password,
  publicKey,
  toData?,
) => {
  const toDataHex = textToHex(toData);
  const toAddressScript = addressToScript(toAddress);
  let toLockType = '';
  if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.Secp256k1) {
    toLockType = 'Secp256k1';
  } else if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.Keccak256) {
    toLockType = 'Keccak256';
  } else if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.AnyPay) {
    toLockType = 'AnyPay';
  }
  let rawTransaction = {};

  // wallet cells check
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);
  const unspentWalletCells = await getUnspentCells(toLockHash);
  let realTxHash;
  let config = { index: 0, length: -1 };

  if (unspentWalletCells.length === 0) {
    rawTransaction = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
  }

  if (toLockType === 'Secp256k1') {
    rawTransaction = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
    config = { index: 0, length: -1 };
  }
  if (toLockType === 'AnyPay') {
    rawTransaction = await generateAnyPayTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toLockType,
    );
    config = { index: 1, length: 1 };
  }

  const signedTx = await signTx(lockHash, password, rawTransaction, config, publicKey);
  try {
    realTxHash = await ckb.rpc.sendTransaction(signedTx);
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }
  return realTxHash;
};
