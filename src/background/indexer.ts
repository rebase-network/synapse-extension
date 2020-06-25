import CKB from '@nervosnetwork/ckb-sdk-core';
import _ from 'lodash';
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

export const indexerIsExistOrCreate = async (lockHash: string, indexFrom: string = '0x0') => {
  const isExist = await getIndexStatusByLockHash(lockHash);
  if (!isExist) {
    await createIndexerByLockHash(lockHash, indexFrom);
  }
};

export async function indexerAddresses(accounts, blkNumber: string = '0x0') {
  accounts.forEach(async (account) => {
    await indexerIsExistOrCreate(account.lock, blkNumber);
  });
}

export async function getTipBlockNumber() {
  const tipBlkNumber = await ckb.rpc.getTipBlockNumber();
  console.log(/tipBlkNumber/, tipBlkNumber);
  return tipBlkNumber;
}
