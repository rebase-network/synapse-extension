import getCKB from '@utils/ckb';

export const getStatusByTxHash = async (txHash) => {
  const ckb = await getCKB();
  const result = await ckb.rpc.getTransaction(txHash);
  return result.txStatus.status;
};

export const getBlockNumberByTxHash = async (txHash) => {
  const ckb = await getCKB();
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
  const ckb = await getCKB();
  return ckb.rpc.sendTransaction(signedTx);
};
