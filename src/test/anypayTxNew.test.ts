import { addKeyperWallet } from '../wallet/addKeyperWallet';
// const utils = require("@nervosnetwork/ckb-sdk-utils/lib");
// import {default as AnyPayLockScript} from '../keyper/locks/anypay';
const AnyPayLockScript = require('../keyper/locks/anypay');

const keyperwalletTest = require('../keyper/keyperwallet');

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const nodeUrl = 'http://106.13.40.34:8114/';
const ckb = new CKB(nodeUrl);

const sendCapacity = BigInt(11100000000);
const sendFee = BigInt(1100000000);

const privateKey = '448ff179b923f0602a00f68f23cb8425d30198446a1b5aa2a016deea2762b1f8';
const password = '123456';
const anypayAddress =
  'ckt1q34rnqhe6qvtulnj9ru7pdm972xwlaknde35fyy9d543s6k00rnehvh9kh80qc389hmm94a586mrw8v6zvhm77g4par';

describe('anypay transaction test', () => {
  // it('get accounts ......', async () => {
  //   jest.setTimeout(150000);
  //   await addKeyperWallet(privateKey, password, "", "");
  //   const accounts = await keyperwalletTest.accounts()
  //   console.log('accounts : ' + JSON.stringify(accounts));
  // })

  it('send anypay transaction', async () => {
    jest.setTimeout(150000);

    // await keyperwalletTest.init();
    // await keyperwalletTest.generateByPrivateKey(privateKey, password);
    await addKeyperWallet(privateKey, password, '', '');

    // const anypayDep = {
    //   hashType: 'type',
    //   codeHash: '0x6a3982f9d018be7e7228f9e0b765f28ceff6d36e634490856d2b186acf78e79b',
    //   outPoint: {
    //     txHash: '0x9af66408df4703763acb10871365e4a21f2c3d3bdc06b0ae634a3ad9f18a6525',
    //     index: '0x0'
    //   }
    // }
    const anypay = new AnyPayLockScript();
    const deps = anypay.deps();
    const anypayDep = {
      hashType: anypay.hashType,
      codeHash: anypay.codeHash,
      outPoint: deps[0].outPoint,
    };
    const publicKey = ckb.utils.privateKeyToPublicKey('0x' + privateKey);
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
    const lockHash = ckb.generateLockHash(publicKeyHash, anypayDep);

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
      fromAddress: anypayAddress,
      toAddress: anypayAddress,
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

    const signedTx = await keyperwalletTest.signTx(signObj.target, password, signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('=== realTxHash ===', realTxHash);
    expect(realTxHash).toHaveLength(66);
  });
});
