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

export interface GenerateTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
}

export const getInputCells = async (lockHash, params) => {
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

export const sendSudtTransaction = async (
  fromAddress,
  fromLockType,
  lockHash,
  sUdtAmount,
  txHash,
  txIndex,
  toAddress,
  sendSudtAmount,
  fee,
  password,
) => {
  const ckb = await getCKB();
  let rawTxObj: any;

  let realTxHash;

  const sUdtInput = {
    previousOutput: {
      txHash: txHash,
      index: txIndex,
    },
    since: '0x0',
  };
  
  // 1.Get transaction by txHash (input SUDT)
  const tx = await ckb.rpc.getTransaction(txHash);
  const outputs = tx.transaction.outputs;
  const sUdtOutput = outputs[Number(txIndex)];
  const { lock: lockScript, type: sUdtTypeScript } = sUdtOutput;

  const fromLockScript = addressToScript(fromAddress);
  const fromLockHash = ckb.utils.scriptToHash(fromLockScript);
  const params = {
    capacity: BigInt(142).toString(),
    hasData: 'false',
  };

  const inputCkbCells = await getInputCells(fromLockHash, params);

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
  if(fromLockType === toLockType){
    const fromDepObj = await getDepFromLockType(fromLockType, NetworkManager);
    deps.push(fromDepObj);
  } else {
    const fromDepObj = await getDepFromLockType(fromLockType, NetworkManager);
    const toDepObj = await getDepFromLockType(toLockType, NetworkManager);
    deps.push(fromDepObj);
    deps.push(toDepObj);
  }
  const sUdtDep = await getDepFromType('simpleudt',NetworkManager);
  deps.push(sUdtDep);

  // 多对一的聚合处理
  // TODO 根据lockHash和typeHash从数据表中获取，发送的SUDT是否已经存在
   const sudtParams = {
    limit: '1',
    hasData: 'true',
  };
  const toSudtOutput = await getUnspentCells(toLockHash, sudtParams);

  rawTxObj = createSudtRawTx(
    sUdtInput,
    sUdtTypeScript,
    inputCkbCells,
    sUdtOutput,
    sUdtAmount,
    fromLockScript,
    sendSudtAmount,
    toLockScript,
    toSudtOutput,
    deps,
    fee,
  );
  console.log(/rawTxObj/,JSON.stringify(rawTxObj));

  // Error handling
  if (rawTxObj.errCode !== undefined && rawTxObj.errCode !== 0) {
    return rawTxObj;
  }

  const signedTx = await signTx(lockHash, password, rawTxObj.tx, rawTxObj.config);
  console.log(/signedTx/,JSON.stringify(signedTx));

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