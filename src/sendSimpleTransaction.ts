import { Ckb } from './utils/constants';
import { getUnspentCells } from './utils/apis';
import newCKB from './wallet/transaction';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(Ckb.remoteRpcUrl);
const newckb = new newCKB(Ckb.remoteRpcUrl);

export const sendSimpleTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  sendCapacity,
  sendFee,
  lockHash,
) => {
  await ckb.loadSecp256k1Dep(); //can't delete

  const unspentCells = await getUnspentCells(lockHash);

  const rawTransaction = newckb.generateRawTransaction({
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
