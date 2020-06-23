import CKB from '@nervosnetwork/ckb-sdk-core';
import * as _ from 'lodash';
import { configService } from '../config';

const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

export const createIndexerByLockHash = async (lockHash: string) => {
  const indexer = await ckb.rpc.indexLockHash(lockHash);
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
