import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { ADDRESS_TYPE_CODEHASH } from '@utils/constants';
import { textToHex, textToBytesLength } from '@utils/index';
import _ from 'lodash';
import { getDepFromLockType } from '@utils/deps';
import { getUnspentCells } from '@utils/apis';
import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';
import { createRawTx, createAnyPayRawTx, createUpdateDataRawTx } from './txGenerator';
import { signTx } from '../addKeyperWallet';

const ckb = new CKB(configService.get('CKB_RPC_ENDPOINT'));

export const generateTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  toDataHex?,
) => {
  const params = {
    capacity: BigInt(toAmount).toString(),
  };
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

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
  const params = {
    capacity: toAmount,
  };
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };

  // Wallet Cell
  const params2 = {
    capacity: toAmount,
  };
  const unspentWalletCells = await getUnspentCells(toLockHash, params2);
  // Error handling
  if (unspentWalletCells.errCode !== undefined && unspentWalletCells.errCode !== 0) {
    return unspentCells;
  }

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

  const params = {
    capacity: cellDataCapacity.toString(),
  };
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

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
  toData = '0x',
) => {
  const toDataHex = textToHex(toData || '0x');
  const toAddressScript = addressToScript(toAddress);
  let toLockType = '';
  if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.Secp256k1) {
    toLockType = 'Secp256k1';
  } else if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.Keccak256) {
    toLockType = 'Keccak256';
  } else if (toAddressScript.codeHash === ADDRESS_TYPE_CODEHASH.AnyPay) {
    toLockType = 'AnyPay';
  }
  let rawTransaction: any;

  // wallet cells check
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);

  // get anypay wallet
  let unspentWalletCells: any;
  if (toLockType === 'AnyPay') {
    const params = {
      limit: '10',
    };
    unspentWalletCells = await getUnspentCells(toLockHash, params);
    // Error handling
    if (unspentWalletCells.errCode !== undefined && unspentWalletCells.errCode !== 0) {
      return unspentWalletCells;
    }
  }

  let realTxHash;
  let config = { index: 0, length: -1 };

  if (toLockType === 'AnyPay' && unspentWalletCells.length === 0) {
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
  // Error handling
  if (rawTransaction.errCode !== undefined && rawTransaction.errCode !== 0) {
    return rawTransaction;
  }
  const signedTx = await signTx(lockHash, password, rawTransaction, config, publicKey);
  try {
    realTxHash = await ckb.rpc.sendTransaction(signedTx);
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }
  return realTxHash;
};
