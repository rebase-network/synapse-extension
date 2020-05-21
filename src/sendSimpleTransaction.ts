/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-21 14:54:37
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-21 15:34:53
 */ 
import { Ckb } from './utils/constants';
import { getUnspentCells } from './utils/apis';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(Ckb.remoteRpcUrl);

export const sendSimpleTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  sendCapacity,
  sendFee,
  lockHash,
) => {
    
  await ckb.loadSecp256k1Dep();//can't delete

  const unspentCells = await getUnspentCells(lockHash);

  const rawTransaction = ckb.generateRawTransaction({
    fromAddress: fromAddress,
    toAddress: toAddress,
    capacity: sendCapacity,
    fee: sendFee,
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
  });

  rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x');
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  const signedTx = ckb.signTransaction(privateKey)(rawTransaction);
  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  return realTxHash;
};
