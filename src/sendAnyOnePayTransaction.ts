import { Ckb } from './utils/constants';
import { getUnspentCells } from './utils/apis';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckb = new CKB(Ckb.remoteRpcUrl);

const AnyPayLockScript = require('../keyper/locks/anypay');
const keyperWallet = require('../keyper/keyperwallet');

export const sendAnyOnePayTransaction = async (
  fromAddress,
  toAddress,
  sendCapacity,
  sendFee,
  lockHash,
  password,
) => {

  const anypay = new AnyPayLockScript();
  const deps = anypay.deps();
  const anypayDep = {
    hashType: anypay.hashType,
    codeHash: anypay.codeHash,
    outPoint: deps[0].outPoint,
  };
//   const publicKey = ckb.utils.privateKeyToPublicKey('0x' + privateKey);
//   const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
//   const lockHash = ckb.generateLockHash(publicKeyHash, anypayDep);

  // method to fetch all unspent cells by lock hash
  const unspentCells = await ckb.loadCells({
    lockHash,
  });

  //generate transaction
  const generateAnyTransaction = (params) => {
    const rawTransaction = ckb.generateRawTransaction(params);
    //the custom lock logic
    if (params.isCustomLock === 1) {
      const outputs = rawTransaction.outputs;
      outputs.forEach((output) => {
        const args = output.lock.args;
        const newargs = '0x' + args.substr(64);
        output.lock.args = newargs;
      });
    }
    return rawTransaction;
  };

  const rawTransaction = generateAnyTransaction({
    fromAddress: fromAddress,
    toAddress: toAddress,
    capacity: sendCapacity,
    fee: sendFee,
    safeMode: true,
    cells: unspentCells,
    deps: anypayDep,
    isCustomLock: 1,
  });

  rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x');
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  const signObj = {
    target: lockHash,
    tx: rawTransaction,
  };

  const signedTx = await keyperWallet.signTx(signObj.target, password, signObj.tx);
  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  console.log('=== realTxHash ===', realTxHash);
  
};
