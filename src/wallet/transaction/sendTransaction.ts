import { BN } from 'bn.js';
import { getUnspentCells } from '../../utils/apis';
import { createRawTx, createAnyPayRawTx } from './txGenerator';
import { addressToScript } from '@keyper/specs';
import { getDepFromLockType } from '../../utils/deps';
import { configService } from '../../config';
import { signTx } from '../addKeyperWallet';
import { ADDRESS_TYPE_CODEHASH } from '../../utils/constants';

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
  toLockType,
) => {
  let rawTransaction = {};

   //wallet cells check
   const toLockScript = addressToScript(toAddress);
   const toLockHash = ckb.utils.scriptToHash(toLockScript);
   const unspentWalletCells = await getUnspentCells(toLockHash);

  if (toLockType == "Secp256k1" && unspentWalletCells.length == 0) {
    
    rawTransaction = await generateTx(fromAddress, toAddress, toAmount, fee, lockHash, lockType);
    console.log('--- rawTransaction ---',JSON.stringify(rawTransaction));
  } else if (toLockType === "AnyPay" && unspentWalletCells.length > 0) {

    rawTransaction = await generateAnyPayTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toLockType,
    );
    console.log('--- rawTransaction ---',JSON.stringify(rawTransaction));
  }

  let config = { index: 1, length: 1 };
  const signedTx = await signTx(lockHash, password, rawTransaction, config);
  console.log('--- signedTx ---',JSON.stringify(signedTx));
  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  console.log('--- signedTx ---',JSON.stringify(signedTx));
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

export const generateAnyPayTx = async (
  fromAddress,
  toAddress,
  toAmount,
  fee,
  lockHash,
  fromLockType,
  toLockType,
) => {
  const fromLockScript = addressToScript(fromAddress);
  const toLockScript = addressToScript(toAddress);
  const toLockHash = ckb.utils.scriptToHash(toLockScript);
  //unspentCells
  const unspentCells = await getUnspentCells(lockHash);
  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };

  //Wallet Cell
  const unspentWalletCells = await getUnspentCells(toLockHash);
  function getWalletTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const walletTotalCapity = unspentWalletCells.reduce(getWalletTotalCapity, 0);

  const depObj = getDepFromLockType(fromLockType);
  const anypayDepObj = getDepFromLockType(toLockType);

  const rawObj = createAnyPayRawTx(
    new BN(toAmount),
    toLockScript,
    inputCells,
    fromLockScript,
    [depObj, anypayDepObj],
    new BN(fee),
    unspentWalletCells,
    walletTotalCapity,
  );
  const rawTransaction = rawObj.tx;

  return rawTransaction;
};
