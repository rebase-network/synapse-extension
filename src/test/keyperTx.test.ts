import { publicKeyToAddress } from "../wallet/address";
const BN = require('bn.js');

const { scriptToHash } = require("@nervosnetwork/ckb-sdk-utils/lib");
const { addressToScript } = require("@keyper/specs");
const keyperwalletTest = require('../keyper/keyperwallet');

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://106.13.40.34:8114/'
const ckb = new CKB(nodeUrl)

const toAddress = "ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae";
const sendCapacity = BigInt(11100000000);
const sendFee = BigInt(1100000000);

const privateKeyKeccak256Dep = "6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1";
const password = "123456";

describe('transaction test', () => {

  it('send simple transaction by Keccak256LockScript', async () => {

    jest.setTimeout(100000);

    await keyperwalletTest.init();
    await keyperwalletTest.generateByPrivateKey(privateKeyKeccak256Dep, password);

    const keccak256Dep = {
      hashType: 'type',
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      outPoint: {
        txHash: '0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e',
        index: '0x0'
      }
    }

    const fromAddress = "ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae";

    /**
     * calculate the lockHash by the address publicKeyHash
     * 1. the publicKeyHash of the address is required in the args field of lock script
     * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
     * 3. calculate the hash of lock script via ckb.utils.scriptToHash method
     */
    // const lockScript = {
    //   hashType: "type",
    //   codeHash: blockAssemblerCodeHash,
    //   args: publicKeyHash,
    // }
    /**
     * to see the lock script
     */
    // console.log(JSON.stringify(lockScript, null, 2))

    // const lockHash = ckb.utils.scriptToHash(lockScript)
    const lockHash = "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2";
    /**
     * to see the lock hash
     */
    // console.log(lockHash)

    // method to fetch all unspent cells by lock hash
    const unspentCells = await ckb.loadCells({
      lockHash
    })

    /**
     * to see the unspent cells
     */
    // console.log("unspentCells => ",unspentCells)

    const rawTransaction = ckb.generateRawTransaction({
      fromAddress: fromAddress,
      toAddress: toAddress,
      capacity: sendCapacity,
      fee: sendFee,
      safeMode: true,
      cells: unspentCells,
      deps: keccak256Dep,
    })
    // console.log(" <=== rawTransaction ===> ",rawTransaction);

    rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x')
    rawTransaction.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: ''
    }
    const lock = addressToScript(fromAddress);
    rawTransaction.outputs.push({
      capacity: `0x${(11100000000).toString(16)}`,
      lock: lock
    });
    rawTransaction.outputsData.push("0x");

    const signObj = {
      target: scriptToHash(lock),
      tx: rawTransaction,
      config: { index: 0, length: rawTransaction.witnesses.length - 1 }
    }

    let config = { index: 0, length: -1 };
    if (signObj.config) {
      config = signObj.config;
    }
    // console.log(" before sign =>");
    //Sign
    const signedTx = await keyperwalletTest.signTx(signObj.target, password, signObj.tx, config);

    // // // const signedTx = ckb.signTransaction(privateKeyKeccak256Dep)(rawTransaction)
    // // // /**
    // // //  * to see the signed transaction
    // // //  */
    console.log("signedTx =>", JSON.stringify(signedTx, null, 2))

    const realTxHash = await ckb.rpc.sendTransaction(signedTx)
    // /**
    //  * to see the real transaction hash
    //  */
    console.log(`The real transaction hash is: ${realTxHash}`)

    expect(realTxHash).toHaveLength(66);
  });
});
//add by river
// console.log(masterKeychain
//             .derivePath(`m/44'/309'/0'/0`)
//             .deriveChild(0,false)
//             .privateKey.toString('hex'))
// console.log(masterKeychain
//             .derivePath(`m/44'/309'/0'/0`)
//             .deriveChild(0,false)
//             .publicKey.toString('hex')) 
// const total = new BN(toAmount)

const rawTx = async function createRawTx(toAmount, toLock, cells, total, lock) {
  const rawTx = {
    version: "0x0",
    cellDeps: [],
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: []
  };
  rawTx.outputs.push({
    capacity: `0x${new BN(toAmount).toString(16)}`,
    lock: toLock,
  });
  rawTx.outputsData.push("0x");
  for (let i = 0; i < cells.cells.length; i++) {
    const element = cells.cells[i];

    rawTx.inputs.push({
      previousOutput: {
        txHash: element.txHash,
        index: element.index,
      },
      since: "0x0",
    });
    rawTx.witnesses.push("0x");
  }
  rawTx.witnesses[0] = {
    lock: "",
    inputType: "",
    outputType: "",
  };
  if (cells.total.gt(total) && cells.total.sub(total).gt(new BN("6100000000"))) {
    rawTx.outputs.push({
      capacity: `0x${cells.total.sub(total).toString(16)}`,
      lock: lock
    });
    rawTx.outputsData.push("0x");
  }
  return rawTx;
}

// unspentCells =>  [
//   {
//     blockHash: '0x3fa610d16c45cc62a68b8b78db9220eecd4cfed59646304d5d766b3990b1d476',
//     lock: {
//       codeHash: '0xac8a4bc0656aeee68d4414681f4b2611341c4f0edd4c022f2d250ef8bb58682f',
//       hashType: 'type',
//       args: '0xc3d3773468867f3a86289b6020537c3ba4f2a334'
//     },
//     outPoint: {
//       txHash: '0x815eb5a9e3a23aebbdeacfe38259a687af46a9da31e235509dc4f8be5514d221',
//       index: '0x0'
//     },
//     outputDataLen: '0x0',
//     capacity: '0x746a528800',
//     cellbase: false,
//     type: null,
//     dataHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//     status: 'live'
//   }
// ]