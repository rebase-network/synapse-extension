import CKB from '@nervosnetwork/ckb-sdk-core';
import * as _ from 'lodash';
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
  page: bigint,
  per: bigint,
  reverseOrder: boolean = true,
) => {
  const transactionList = await ckb.rpc.getTransactionsByLockHash(
    lockHash,
    page,
    per,
    reverseOrder,
  );
  return transactionList;
};
