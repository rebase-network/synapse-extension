import CKB from '@nervosnetwork/ckb-sdk-core';
import * as _ from 'lodash';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { EMPTY_TX_HASH } from '@utils/constants';
import { configService } from '../config';

const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

export const createIndexerByLockHash = async (lockHash: string, indexFrom: string = '0x0') => {
  const indexer = await ckb.rpc.indexLockHash(lockHash, indexFrom);
  return indexer;
};

export const getIndexStatusByLockHash = async (lockHash: string) => {
  const indexers = await ckb.rpc.getLockHashIndexStates();
  const result = _.find(indexers, (indexer) => {
    return indexer.lockHash === lockHash;
  });
  if (!_.isEmpty(result)) {
    return true;
  }
  return false;
};

export const getTransactionsByLockHash = async (
  lockHash: string,
  page: bigint = BigInt(0),
  per: bigint = BigInt(10),
  reverseOrder: boolean = true,
) => {
  const transactionList = await ckb.rpc.getTransactionsByLockHash(
    lockHash,
    page,
    per,
    reverseOrder,
  );

  let blockNumberAndTxHashList = [];
  for (let index = 0; index < transactionList.length; index++) {
    const txObj = transactionList[index];
    const { consumedBy, createdBy } = txObj;
    if (!_.isEmpty(consumedBy)) {
      const consumedObj = {
        blockNumber: consumedBy.blockNumber,
        txHash: consumedBy.txHash,
      };
      blockNumberAndTxHashList.push(consumedObj);
    }
    if (!_.isEmpty(createdBy)) {
      const createdObj = {
        blockNumber: createdBy.blockNumber,
        txHash: createdBy.txHash,
      };
      blockNumberAndTxHashList.push(createdObj);
    }
  }
  blockNumberAndTxHashList = _.uniqBy(blockNumberAndTxHashList, 'txHash');
  return blockNumberAndTxHashList;
};

export const parseBlockTxs = async (txs: TxHistory[]) => {
  const newTxs = [];
  for (const tx of txs) {
    const newTx: Partial<NewTx> = {};
    newTx.hash = tx.txHash;
    if (tx.blockNumber) {
      newTx.blockNum = parseInt(tx.blockNumber, 16);
      const header = await ckb.rpc.getHeaderByNumber(tx.blockNumber);
      if (!header) continue;
      newTx.timestamp = parseInt(header.timestamp, 16);
    }

    const txObj = await ckb.rpc.getTransaction(tx.txHash);
    const { outputs, inputs } = txObj.transaction;
    const newInputs = [];
    for (const input of inputs) {
      const befTxHash = input.previousOutput.txHash;
      if (befTxHash !== EMPTY_TX_HASH) {
        // 0x000......00000 是出块奖励，inputs为空，cellbase
        const befIndex = input.previousOutput.index;
        const inputTxObj = await ckb.rpc.getTransaction(befTxHash);
        const inputTx = inputTxObj.transaction;
        const output = inputTx.outputs[parseInt(befIndex, 16)];
        const newInput = getReadableCell(output);
        newInputs.push(newInput);
      }
    }

    newTx.inputs = newInputs;
    const newOutputs = [];
    for (const output of outputs) {
      const newOutput = getReadableCell(output);
      newOutputs.push(newOutput);
    }

    newTx.outputs = newOutputs;
    newTxs.push(newTx);
  }
  return newTxs;
};

export const getTxDetails = async (blockTxs, args) => {
  for (const tx of blockTxs) {
    // Object.values(tx.inputs).map(item => item.capacity);
    // Object.values(tx.outputs).map(item => item.capacity);
    const inSum = tx.inputs.reduce((prev, next) => prev + next.capacity, 0);
    const outSum = tx.outputs.reduce((prev, next) => prev + next.capacity, 0);
    const fee = inSum - outSum;
    tx.fee = fee < 0 ? 0 : fee; // handle cellBase condition

    let flag = false;
    tx.amount = 0;

    for (const input of tx.inputs) {
      if (input.lockArgs === args) {
        flag = true;
        tx.income = false; // 入账\收入
        for (const output of tx.outputs) {
          if (output.lockArgs !== args) {
            tx.amount = output.capacity;
            break;
          }
        }
        break;
      }
    }
    if (!flag) {
      tx.income = true; // 入账\收入
      for (const output of tx.outputs) {
        if (output.lockArgs === args) {
          tx.amount = output.capacity;
          break;
        }
      }
    }
  }
  return blockTxs;
};

export const getTxHistories = async (typeScript) => {
  const script: CKBComponents.Script = {
    args: typeScript.script.args,
    codeHash: typeScript.script.code_hash,
    hashType: typeScript.script.hash_type,
  };
  const lockHash = ckbUtils.scriptToHash(script);
  const { args } = typeScript.script;
  const transactionList = await getTransactionsByLockHash(lockHash);
  const blockTxs = await parseBlockTxs(transactionList);
  const result = await getTxDetails(blockTxs, args);
  return result;
};

function getReadableCell(output) {
  const result: ReadableCell = {
    capacity: parseInt(output.capacity, 16),
    lockHash: ckbUtils.scriptToHash(output.lock),
    lockCodeHash: output.lock.codeHash,
    lockArgs: output.lock.args,
    lockHashType: output.lock.hashType,
  };
  return result;
}

export interface TxHistory {
  blockNumber: string;
  txHash: string;
}

export interface ReadableCell {
  capacity: number;
  lockHash: string;
  lockCodeHash: string;
  lockArgs: string;
  lockHashType: string;
}

export interface NewTx {
  hash: string;
  blockNum: number;
  timestamp: number;
  inputs: any[];
  outputs: any[];
}
