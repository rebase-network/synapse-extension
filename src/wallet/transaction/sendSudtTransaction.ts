import { BN } from 'bn.js';
import _ from 'lodash';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '@utils/apis';
import getCKB from '@utils/ckb';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { createSudtRawTx } from './txSudtGenerator';
import { getDepFromLockType } from '@src/utils/deps';
import { ADDRESS_TYPE_CODEHASH } from '@src/utils/constants';
import { getDepFromType } from '@src/utils/constants/TypesInfo';
import { parseSUDT } from '@src/utils';

export interface GenerateTxResult {
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
    console.log(parseSUDT(cell.outputData));
    return BigInt(total) + BigInt(parseSUDT(cell.outputData));
  }
  const sudtAmount = unspentCells.reduce(getTotalSudtCapity, 0);
  
  const inputCells = {
    cells: unspentCells,
    sudtCKBCapacity: sudtCKBCapity,
    sudtAmount: sudtAmount,
  };
  return inputCells;
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
  const ckb = await getCKB();
  let rawTxObj: any;

  let realTxHash;
  const fromLockScript = addressToScript(fromAddress);
  const fromLockHash = ckb.utils.scriptToHash(fromLockScript);
  const params = {
    capacity: BigInt(142).toString(),
    hasData: 'false',
  };
  // 1. input CKB cells
  const inputCkbCells = await getInputCKBCells(fromLockHash, params);
  console.log(/inputCkbCells/, inputCkbCells);

  const sudtParams = {
    limit: '20',
    hasData: 'true',
    typeHash: typeHash,
  };
  // 2. Input sudt cells
  const inputSudtCells = await getInputSudtCells(fromLockHash, sudtParams);

  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);

  let toLockType = null;
  if (toLockScript.codeHash === ADDRESS_TYPE_CODEHASH.Secp256k1) {
    toLockType = 'Secp256k1';
  } else if (toLockScript.codeHash === ADDRESS_TYPE_CODEHASH.Keccak256) {
    toLockType = 'Keccak256';
  } else if (toLockScript.codeHash === ADDRESS_TYPE_CODEHASH.AnyPay) {
    toLockType = 'AnyPay';
  }

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
  // Error handling
  if (rawTxObj.errCode !== undefined && rawTxObj.errCode !== 0) {
    return rawTxObj;
  }

  const signedTx = await signTx(lockHash, password, rawTxObj.tx, rawTxObj.config);
  console.log(/signedTx/, JSON.stringify(signedTx));

  const txResultObj = {
    txHash: null,
    fee: rawTxObj.fee,
  };
  try {
    realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log(/realTxHash/, JSON.stringify(realTxHash));
    txResultObj.txHash = realTxHash;
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }

  return txResultObj;
};
