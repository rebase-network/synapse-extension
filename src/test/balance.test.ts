import Address, { AddressType, publicKeyToAddress, AddressPrefix } from '../wallet/address'
import loadCells from '../wallet/balance/loadCells';
import {getBalanceByPublicKey} from '../balance';

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://localhost:8114'
const ckb = new CKB(nodeUrl)
// console.log("ckb => ",JSON.stringify(ckb))

const privateKey = '0xdcec27d0d975b0378471183a03f7071dea8532aaf968be796719ecd20af6988f';

describe('generate lockHash', () => {
  
  const publicKeyHash = "";
  // const params = {
  //   publicKeyHash: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
  //   deps: {
  //     hashType: 'type',
  //     codeHash: '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2',
  //   },
  // }

  it('get balance by publicKey',async () => {
    const publicKey = "0x037a3192467ef7046070b49eaa2f4706fee19a69bcdd7f6d3b8ab4f7407365089e";
    const capacityAll = await getBalanceByPublicKey(publicKey);
    console.log(capacityAll);
    expect(BigInt(capacityAll)).toBe(BigInt(1000000000000));
  })

  // it('get balance by address',async () => {
  //   const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
  //   console.log("publicKey =>", publicKey); //0x037a3192467ef7046070b49eaa2f4706fee19a69bcdd7f6d3b8ab4f7407365089e
  //   const address = publicKeyToAddress(publicKey, AddressPrefix.Testnet);
  //   console.log("address =>", address); //ckt1qyqwmdw88u4y4kxlydr8e8e5gm6c2x67x0dqqxpt4l

  //   const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  //   await ckb.loadSecp256k1Dep();
  //   // console.log(ckb.config.secp256k1Dep);
  //   const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)
  //   expect(lockHash).toBe('0x518873a48f98d19cd1529db846a6d4d89ce92577660e72080b74e3dccd45dfb0')

  //   const tipBlockNumber = await ckb.rpc.getTipBlockNumber();
  //   console.log(tipBlockNumber)
  //   // const cells = await ckb.rpc.getCellsByLockHash(lockHash, '0x687f', tipBlockNumber)
  //   // console.log(JSON.stringify(cells));
  //   // let capacityAll = BigInt(0);
  //   // for (let cell of cells) {
  //   //   // console.log(JSON.stringify(cell));
  //   //   // console.log(BigInt(cell.capacity));
  //   //   capacityAll = capacityAll + BigInt(cell.capacity);
  //   // }
  //   // console.log(BigInt(capacityAll));
  //   // expect(BigInt(capacityAll)).toBe(BigInt(500000000000));
  //   const cells = await loadCells({
  //     lockHash: lockHash,
  //     start: '0x1',
  //     end: tipBlockNumber,
  //     STEP: '0x64',
  //     rpc: ckb.rpc,
  //   });
  //   let capacityAll = BigInt(0);
  //   for (let cell of cells) {
  //     // console.log(JSON.stringify(cell));
  //     // console.log(BigInt(cell.capacity));
  //     capacityAll = capacityAll + BigInt(cell.capacity);
  //   }
  //   console.log(BigInt(capacityAll));

  //   // console.log(`0x${currentFrom.toString(16)}`);
  //   // console.log(`0x${currentTo.toString(16)}`);

  // })
})


// console.log src/test/balance.test.ts:35
// 0x688a

// console.log src/test/balance.test.ts:37
// [
//   {
//     blockHash: '0xada9ff6e1b1839d8756ec2270af92e2beb36bd859fb051c1f67daa86d2603f81',
//     lock: {
//       codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
//       hashType: 'type',
//       args: '0xedb5c73f2a4ad8df23467c9f3446f5851b5e33da'
//     },
//     outPoint: {
//       txHash: '0xfdf2de9201544017c66f68e841cce9831930fd5251bdb6fdcffb641c30ed6123',
//       index: '0x0'
//     },
//     outputDataLen: '0x0',
//     capacity: '0x746a528800',
//     cellbase: false,
//     type: null
//   }
// ]


// public generateLockHash = (
//   publicKeyHash: PublicKeyHash,
//   deps: Omit<DepCellInfo, 'outPoint'> | undefined = this.config.secp256k1Dep,
// ) => {
//   if (!deps) {
//     throw new ArgumentRequired('deps')
//   }

//   return this.utils.scriptToHash({
//     hashType: deps.hashType,
//     codeHash: deps.codeHash,
//     args: publicKeyHash,
//   })
// }

// public loadSecp256k1Dep = () => {
//   const genesisBlock = await this.rpc.getBlockByNumber('0x0')

//   /* eslint-disable prettier/prettier, no-undef */
//   const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
//   const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type
//   /* eslint-enable prettier/prettier, no-undef */

//   if (!secp256k1DepTxHash) {
//     throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
//   }

//   if (!typeScript) {
//     throw new Error('Secp256k1 type script not found')
//   }

//   const secp256k1TypeHash = this.utils.scriptToHash(typeScript)

//   this.config.secp256k1Dep = {
//     hashType: 'type',
//     codeHash: secp256k1TypeHash,
//     outPoint: {
//       txHash: secp256k1DepTxHash,
//       index: '0x0',
//     },
//   }
//   return this.config.secp256k1Dep
// }