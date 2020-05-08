import { publicKeyToAddress } from "../wallet/address";
const CkbUtils = require("@nervosnetwork/ckb-sdk-utils");

const keyperwalletTest = require('../keyper/keyperwallet');

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://106.13.40.34:8114/'
const ckb = new CKB(nodeUrl)

const sendCapacity = BigInt(11100000000);
const sendFee = BigInt(1100000000);

const privateKey = "448ff179b923f0602a00f68f23cb8425d30198446a1b5aa2a016deea2762b1f8";
const password = "123456";
const anypayAddress = "ckt1q34rnqhe6qvtulnj9ru7pdm972xwlaknde35fyy9d543s6k00rnehvh9kh80qc389hmm94a586mrw8v6zvhm77g4par";

describe('anypay transaction test', () => {

  // // parseAddress
  // it('send simple transaction', async () => {
  //   const pkHashSecp256k1 = CkbUtils.parseAddress("ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae", 'hex');
  //   expect(pkHashSecp256k1).toEqual("0x9b84887ab2ea170998cff9895675dcd29cd26d4d");
  // });

  // it('send simple transaction', async () => {

  //   const pkHashKeccak256 = CkbUtils.parseAddress("ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs3s7nwu6x3pnl82rz3xmqypfhcway723ngkutufp", 'hex');
  //   expect(pkHashKeccak256).toEqual("0xc3d3773468867f3a86289b6020537c3ba4f2a334");
  // });
  // it('send simple transaction', async () => {
  //   const pkHashAnyPay = CkbUtils.parseAddress("ckt1q34rnqhe6qvtulnj9ru7pdm972xwlaknde35fyy9d543s6k00rnehxuy3pat96shpxvvl7vf2e6ae55u6fk566eyvpl", 'hex');
  //   expect(pkHashAnyPay).toEqual("0x9b84887ab2ea170998cff9895675dcd29cd26d4d");
  // });

  // it('get accounts ......', async () => {
  //   jest.setTimeout(150000);
  //   await keyperwalletTest.init();
  //   await keyperwalletTest.generateByPrivateKey(privateKey, password);
  //   //   // 0001- 
  //   const accounts = await keyperwalletTest.accounts()
  //   console.log('accounts : ' + JSON.stringify(accounts));
  // })

  it('send anypay transaction', async () => {

    jest.setTimeout(150000)

    await keyperwalletTest.init();
    await keyperwalletTest.generateByPrivateKey(privateKey, password);

     const anypayDep = {
      hashType: 'type',
      codeHash: '0x6a3982f9d018be7e7228f9e0b765f28ceff6d36e634490856d2b186acf78e79b',
      outPoint: {
        txHash: '0x9af66408df4703763acb10871365e4a21f2c3d3bdc06b0ae634a3ad9f18a6525',
        index: '0x0'
      }
    }
    const publicKey = ckb.utils.privateKeyToPublicKey("0x" + privateKey)
 
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

    const lockHash = ckb.generateLockHash(publicKeyHash, anypayDep)

    // /**
    //  * to see the lock hash
    //  */
    console.log(lockHash)

    // method to fetch all unspent cells by lock hash
    const unspentCells = await ckb.loadCells({
      lockHash
    })

    //generate transaction
    const generateAnyTransaction = (params) => {
      console.log("--- params ---", params);
      const rawTransaction = ckb.generateRawTransaction(
        params
      )
      //the custom lock logic
      if (params.isCustomLock === 1) {
        const outputs = rawTransaction.outputs;
        outputs.forEach(output => {
          const args = output.lock.args;
          const newargs = "0x" + args.substr(64);
          output.lock.args = newargs;
        });
      }
      return rawTransaction;
    }

    const rawTransaction = generateAnyTransaction({
      fromAddress: anypayAddress,
      toAddress: anypayAddress,
      capacity: sendCapacity,
      fee: sendFee,
      safeMode: true,
      cells: unspentCells,
      deps: anypayDep,
      isCustomLock: 1,
    })

    rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x')
    rawTransaction.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: ''
    }

    const signObj = {
      target: lockHash,
      tx: rawTransaction
    }
    const signedTx = await keyperwalletTest.signTx(signObj.target, password, signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx)
    expect(realTxHash).toHaveLength(66);
  });
});