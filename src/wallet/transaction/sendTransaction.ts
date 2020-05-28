import { BN } from 'bn.js';
import { Ckb } from '../../utils/constants';
import { getUnspentCells } from '../../utils/apis';
import { createRawTx } from './txGenerator';
import { addressToScript } from '@keyper/specs';
import { getDepFromLockType } from '../../utils/deps';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckb = new CKB(Ckb.remoteRpcUrl);

export const sendTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
) => {
  await ckb.loadSecp256k1Dep(); //can't delete

  const unspentCells = await getUnspentCells(lockHash);
  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };

  const fromLockScript = addressToScript(fromAddress);
  const toLockScript = addressToScript(toAddress);

  const depObj = getDepFromLockType(lockType);

  const rawObj = createRawTx(new BN(toAmount), toLockScript, inputCells, fromLockScript, [depObj], new BN(fee));
  const rawTransaction = rawObj.tx;

  const signedTx = ckb.signTransaction(privateKey)(rawTransaction);
  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  return realTxHash;
};
