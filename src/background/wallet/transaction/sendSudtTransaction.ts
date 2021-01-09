import BN from 'bn.js';
import _ from 'lodash';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '@common/utils/apis';
import getCKB from '@common/utils/ckb';
import { signTx } from '@background/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { getDepFromLockType } from '@common/utils/deps';
import { SUDT_MIN_CELL_CAPACITY, CKB_TOKEN_DECIMALS } from '@common/utils/constants';
import { getDepFromType } from '@common/utils/constants/typesInfo';
import { parseSUDT } from '@common/utils';
import getLockTypeByCodeHash from './getLockTypeByCodeHash';
import { createSudtRawTx } from './txSudtGenerator';

interface GenerateTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
}

export const getInputCKBCells = async (lockHash, params) => {
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
  return inputCells;
};

export const getInputSudtCells = async (lockHash, params) => {
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
  }

  function getTotalCKBCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const sudtCKBCapity = unspentCells.reduce(getTotalCKBCapity, 0);

  function getTotalSudtCapity(total, cell) {
    return BigInt(total) + BigInt(parseSUDT(cell.outputData));
  }
  const sudtAmount = unspentCells.reduce(getTotalSudtCapity, 0);

  const inputCells = {
    cells: unspentCells,
    sudtCKBCapacity: sudtCKBCapity,
    sudtAmount,
  };
  return inputCells;
};

export const createSudtTransaction = async (
  fromAddress,
  fromLockType,
  typeHash,
  toAddress,
  sendSudtAmount,
  fee,
) => {
  const ckb = await getCKB();

  const fromLockScript = addressToScript(fromAddress);
  const fromLockHash = ckb.utils.scriptToHash(fromLockScript);
  const params = {
    capacity: SUDT_MIN_CELL_CAPACITY * CKB_TOKEN_DECIMALS,
    hasData: 'false',
  };
  // 1. input CKB cells
  const inputCkbCells = await getInputCKBCells(fromLockHash, params);

  const sudtParams = {
    limit: '20',
    hasData: 'true',
    typeHash,
  };
  // 2. Input sudt cells
  const inputSudtCells = await getInputSudtCells(fromLockHash, sudtParams);

  const toLockScript = addressToScript(toAddress);

  const toLockType = getLockTypeByCodeHash(toLockScript.codeHash);

  const deps = [];
  if (fromLockType === toLockType) {
    const fromDepObj = await getDepFromLockType(fromLockType, NetworkManager);
    deps.push(fromDepObj);
  } else {
    const fromDepObj = await getDepFromLockType(fromLockType, NetworkManager);
    const toDepObj = await getDepFromLockType(toLockType, NetworkManager);
    deps.push(fromDepObj);
    deps.push(toDepObj);
  }
  const sUdtDep = await getDepFromType('simpleudt', NetworkManager);
  deps.push(sUdtDep);

  const sUdtAmount = inputSudtCells.sudtAmount;
  let rawTxObj: any = null;
  rawTxObj = createSudtRawTx(
    inputCkbCells,
    inputSudtCells,
    sUdtAmount,
    fromLockScript,
    sendSudtAmount,
    toLockScript,
    deps,
    fee,
  );
  return rawTxObj;
};

export const signSudtTransaction = async (lockHash, password, rawTxObj) => {
  if (rawTxObj.errCode !== undefined && rawTxObj.errCode !== 0) {
    return rawTxObj;
  }
  const signedTx = await signTx(lockHash, password, rawTxObj.tx, rawTxObj.config);
  return signedTx;
};

export const sendSudtTransaction = async (
  fromAddress,
  fromLockType,
  lockHash,
  typeHash,
  toAddress,
  sendSudtAmount,
  fee,
  password,
) => {
  const rawTxObj = await createSudtTransaction(
    fromAddress,
    fromLockType,
    typeHash,
    toAddress,
    sendSudtAmount,
    fee,
  );

  const signedTx = await signSudtTransaction(lockHash, password, rawTxObj);
  const txResultObj = {
    txHash: null,
  };
  try {
    const ckb = await getCKB();
    const realTxHash: any = await ckb.rpc.sendTransaction(signedTx);
    if (realTxHash.code !== undefined && realTxHash.code !== 0) {
      return {
        errCode: realTxHash.code,
        message: realTxHash.message,
      };
    }
    txResultObj.txHash = realTxHash;
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }

  return txResultObj;
};
