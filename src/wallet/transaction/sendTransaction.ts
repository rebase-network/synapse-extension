import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { ADDRESS_TYPE_CODEHASH } from '@utils/constants';
import { textToHex } from '@utils/index';
import _ from 'lodash';
import { getDepFromLockType } from '@utils/deps';
import { getUnspentCells } from '@utils/apis';
import getCKB from '@utils/ckb';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { createRawTx, createAnyPayRawTx } from './txGenerator';

export interface GenerateTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
}

export const generateTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  toDataHex?,
): Promise<GenerateTxResult> => {
  const params = {
    capacity: BigInt(toAmount).toString(),
    hasData: 'false',
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
  const resultObj = {
    tx: rawObj.tx,
    fee: rawObj.fee,
  };
  return resultObj;
};

export const generateAnyPayTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  fromLockType,
  toLockType,
): Promise<GenerateTxResult> => {
  const ckb = await getCKB();
  const fromLockScript = addressToScript(fromAddress);
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);
  // unspentCells
  const params = {
    capacity: toAmount,
    hasData: 'false',
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
    hasData: 'false',
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
    fee: '',
    tx: null,
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

  const resultObj = {
    tx: rawObj.tx,
    fee: rawObj.fee,
  };
  return resultObj;
};

export const sendTransaction = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  password,
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

  let rawTxObj: any;

  // wallet cells check
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);

  // get anypay wallet
  let unspentWalletCells: any;
  if (toLockType === 'AnyPay') {
    const params = {
      limit: '10',
      hasData: 'false',
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
    rawTxObj = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
    config = { index: 0, length: -1 };
  } else if (toLockType === 'AnyPay' && unspentWalletCells.length > 0) {
    rawTxObj = await generateAnyPayTx(
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
    rawTxObj = await generateTx(
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
  if (rawTxObj.errCode !== undefined && rawTxObj.errCode !== 0) {
    return rawTxObj;
  }

  const signedTx = await signTx(lockHash, password, rawTxObj.tx, config);
  const txResultObj = {
    txHash: null,
    fee: rawTxObj.fee,
  };

  try {
    realTxHash = await ckb.rpc.sendTransaction(signedTx);
    txResultObj.txHash = realTxHash;
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }

  return txResultObj;
};

export const genDummyTransaction = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
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

  let rawTxObj: any;

  // wallet cells check
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);

  // get anypay wallet
  let unspentWalletCells: any;
  if (toLockType === 'AnyPay') {
    const params = {
      limit: '10',
      hasData: 'false',
    };
    unspentWalletCells = await getUnspentCells(toLockHash, params);
    // Error handling
    if (unspentWalletCells.errCode !== undefined && unspentWalletCells.errCode !== 0) {
      return unspentWalletCells;
    }
  }

  let config = { index: 0, length: -1 };

  if (toLockType === 'AnyPay' && unspentWalletCells.length === 0) {
    rawTxObj = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
    config = { index: 0, length: -1 };
  } else if (toLockType === 'AnyPay' && unspentWalletCells.length > 0) {
    rawTxObj = await generateAnyPayTx(
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

    rawTxObj = await generateTx(
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

  return rawTxObj.tx;

};
