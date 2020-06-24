import CKB from '@nervosnetwork/ckb-sdk-core';
import { configService } from '../config';

const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

export const getStatusByTxHash = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  return result.txStatus.status;
};

export const getBlockNumberByTxHash = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  if (result.txStatus.blockHash == null) {
    return BigInt(0);
  }
  const depositBlockHeader = await ckb.rpc
    .getBlock(result.txStatus.blockHash)
    .then((b) => b.header);
  return BigInt(depositBlockHeader.number);
};

export const sendSignedTx = async (signedTx) => {
  return ckb.rpc.sendTransaction(signedTx);
};
