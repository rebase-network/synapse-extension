import { BN } from 'bn.js';
import { Ckb } from '../../utils/constants';
import { getUnspentCells } from '../../utils/apis';
import { createRawTx } from './txGenerator';
import { addressToScript } from '@keyper/specs';
import { getDepFromLockType } from '../../utils/deps';
import { configService } from '../../config';
import  { signTx } from '../addKeyperWallet';
 
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

export const sendTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  lockType,
  password,
) => {
  const rawTransaction = await generateTx(fromAddress, toAddress, toAmount, fee, lockHash, lockType);

  let config = {index: 0, length: -1};
  const signedTx = await signTx(lockHash, password, rawTransaction, config);

  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  return realTxHash;
};

export const generateTx = async (fromAddress, toAddress, toAmount, fee, lockHash, lockType) => {
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

  const rawObj = createRawTx(
    new BN(toAmount),
    toLockScript,
    inputCells,
    fromLockScript,
    [depObj],
    new BN(fee),
  );
  const rawTransaction = rawObj.tx;

  return rawTransaction;
};
