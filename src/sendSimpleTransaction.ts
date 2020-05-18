import { Ckb } from './utils/constants';
import {getUnspentCells} from './utils/apis'

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(Ckb.remoteRpcUrl);

export const sendSimpleTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  sendCapacity,
  sendFee,
) => {

  const secp256k1Dep = await ckb.loadSecp256k1Dep(); // Can not delete, will effect ckb.config.secp256k1Dep
  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;

  const unspentCells = await getUnspentCells(publicKeyHash)

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
