// const BN = require('bn.js');

// const { addressToScript } = require('@keyper/specs');
// const { scriptToHash } = require('@nervosnetwork/ckb-sdk-utils/lib');

// const CKB = require('@nervosnetwork/ckb-sdk-core').default;
// const nodeUrl = 'http://101.200.147.143:8117/rpc';
// const ckb = new CKB(nodeUrl);

// describe('transaction test', () => {

//   const privateKey = '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1';
//   const fromAddress = 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae';
//   const toAddress = 'ckt1qyqvkdgtra55kgh2ngcuppr5vy5pw7g5z7yqrajwwp';
//   const sendCapacity = BigInt(11100000000);
//   const sendFee = BigInt(1100000000);
//   const password = '123456';

//   it('send Anypay', async () => {
//     jest.setTimeout(100000);

//     const secp256Deps = await ckb.loadSecp256k1Dep(); //can't delete
//     console.log('secp256Deps ===>', JSON.stringify(secp256Deps));

//     const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
//     const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
//     const lockHash = ckb.generateLockHash(publicKeyHash, secp256Deps);

//     // const totalcapacity = new BN(toAmount);
//     const toAmount = new BN(11100000000);
//     const toLock = addressToScript(toAddress);
//     const lock = addressToScript(fromAddress);

//     const unspentCells = await ckb.loadCells({
//       lockHash,
//     });
//     const rawTx = await createRawTxSecp256(toAmount, toLock, unspentCells, lock,secp256Deps);

//     rawTx.witnesses = rawTx.inputs.map(() => '0x');
//     rawTx.witnesses[0] = {
//       lock: '',
//       inputType: '',
//       outputType: '',
//     };

//     const signObj = {
//       target: scriptToHash(lock),
//       tx: rawTx,
//     };

//     const signedTx = ckb.signTransaction(privateKey)(rawTx);
//     console.log('signedTx =>', JSON.stringify(signedTx, null, 2));

//     const realTxHash = await ckb.rpc.sendTransaction(signedTx);
//     console.log('realTxHash =>', JSON.stringify(realTxHash));
//   });
// });

// // {
// //     "hashType":"type",
// //     "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
// //     "outPoint":{
// //         "txHash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
// //         "index":"0x0"
// //     }
// // }

// async function createRawTxSecp256(toAmount, toLock, cells, lock,deps) {
//   const rawTx = {
//     version: '0x0',
//     cellDeps: [{
//         outPoint: deps.outPoint,
//         depType: 'depGroup',
//       },
//     ],
//     headerDeps: [],
//     inputs: [],
//     outputs: [],
//     witnesses: [],
//     outputsData: [],
//   };
//   rawTx.outputs.push({
//     capacity: `0x${new BN(toAmount).toString(16)}`,
//     lock: toLock,
//   });
//   rawTx.outputsData.push('0x');

//   let totalcapacity = new BN(0);
//   // const total = new BN(toAmount).add(new BN("1000"));
//   for (let i = 0; i < cells.length; i++) {
//     const element = cells[i].outPoint;

//     rawTx.inputs.push({
//       previousOutput: {
//         txHash: element.txHash,
//         index: element.index,
//       },
//       since: '0x0',
//     });
//     // rawTx.witnesses.push('0x');
//     totalcapacity = totalcapacity.add(new BN(cells[i].capacity));
//   }
//   //   rawTx.witnesses[0] = {
//   //     lock: '',
//   //     inputType: '',
//   //     outputType: '',
//   //   };
//   // if (cells.total.gt(total) && cells.total.sub(total).gt(new BN("6100000000"))) {
//   rawTx.outputs.push({
//     capacity: `0x${totalcapacity.sub(toAmount).toString(16)}`,
//     lock: lock,
//   });
//   rawTx.outputsData.push('0x');
//   // }
//   return rawTx;
// }
