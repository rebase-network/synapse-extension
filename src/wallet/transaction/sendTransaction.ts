import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { ADDRESS_TYPE_CODEHASH } from '@utils/constants';
import { textToHex, textToBytesLength } from '@utils/index';
import _ from 'lodash';
import { getDepFromLockType } from '@utils/deps';
import { getUnspentCells } from '@utils/apis';
import getCKB from '@utils/ckb';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { createRawTx, createAnyPayRawTx, createUpdateDataRawTx } from './txGenerator';

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

  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
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

  const depObj = await getDepFromLockType(lockType, NetworkManager);

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
  const ckb = await getCKB();
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
  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
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
    limit: '10',
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

  const fromDepObj = await getDepFromLockType(fromLockType, NetworkManager);
  const toDepObj = await getDepFromLockType(toLockType, NetworkManager);

  const fromCodeHash = fromLockScript.codeHash;
  const toCodeHash = toLockScript.codeHash;
  // anypay to anypay deps = 1
  let rawObj = {
    target: '',
    tx: {},
  };

  if (fromCodeHash === toCodeHash) {
    rawObj = createAnyPayRawTx(
      new BN(toAmount),
      toLockScript,
      inputCells,
      fromLockScript,
      [toDepObj],
      new BN(fee),
      unspentWalletCells,
      walletTotalCapity,
    );
  } else {
    rawObj = createAnyPayRawTx(
      new BN(toAmount),
      toLockScript,
      inputCells,
      fromLockScript,
      [fromDepObj, toDepObj],
      new BN(fee),
      unspentWalletCells,
      walletTotalCapity,
    );
  }

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
  const ckb = await getCKB();
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
  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
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
  const signedTx = await signTx(lockHash, password, rawTransaction, config);

  const ckb = await getCKB();
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
  const ckb = await getCKB();
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
    config = { index: 0, length: -1 };
  } else if (toLockType === 'AnyPay') {
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
  } else if (toLockType === 'Secp256k1') {
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

  // Error handling
  if (rawTransaction.errCode !== undefined && rawTransaction.errCode !== 0) {
    return rawTransaction;
  }

  const signedTx = await signTx(lockHash, password, rawTransaction, config);
  try {
    realTxHash = await ckb.rpc.sendTransaction(signedTx);
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }

  return realTxHash;
};
