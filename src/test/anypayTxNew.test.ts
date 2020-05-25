import { addKeyperWallet } from '../wallet/addKeyperWallet';

const AnyPayLockScript = require('../keyper/locks/anypay');
const keyper = require('../keyper/keyperwallet');

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const nodeUrl = 'http://101.200.147.143:8117/';
const ckb = new CKB(nodeUrl);

const sendCapacity = BigInt(11100000000);
const sendFee = BigInt(1100000000);

const privateKey = '448ff179b923f0602a00f68f23cb8425d30198446a1b5aa2a016deea2762b1f8';
const password = '123456';
const anypayAddress =
  'ckt1q34rnqhe6qvtulnj9ru7pdm972xwlaknde35fyy9d543s6k00rnehvh9kh80qc389hmm94a586mrw8v6zvhm77g4par';

describe('anypay transaction', () => {
  it('send anypay transaction', async () => {
    jest.setTimeout(150000);

    await addKeyperWallet(privateKey, password, '', '');

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

    const signedTx = await keyper.signTx(signObj.target, password, signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('=== realTxHash ===', realTxHash);
    expect(realTxHash).toHaveLength(66);
  });
});
