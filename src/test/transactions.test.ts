// import Address, { AddressType, publicKeyToAddress, AddressPrefix } from '../wallet/address'
// import loadCells from '../wallet/balance/loadCells';
// import {getBalanceByPublicKey} from '../balance';

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://106.13.40.34:8114/'
const ckb = new CKB(nodeUrl)

describe('transaction test', () => {

  it('get transaction by lockhash',async () => {
    // console.log("ckb => ",JSON.stringify(ckb));

    const publicKey = "0x0304d793194278a005407cd53e6fbd290d8e2a8e90154b4123dc5e0e06a8a19ecb";
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

    await ckb.loadSecp256k1Dep();
    // console.log(ckb.config.secp256k1Dep);
    const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)

    // const transactions = await ckb.rpc.getTransaction("0xc2d441a2fe62a114138076765d2439e9131304212618294f1d762eb6950317d6");
    // const transactions = await ckb.rpc.getTransactionsByLockHash(lockHash,'0xa','0xe',false);
    // console.log("transactions => ",transactions);
    // expect(BigInt(capacityAll)).toBe(BigInt(1000000000000));
  })

})


// // console.log src/test/balance.test.ts:35
// // 0x688a

// // console.log src/test/balance.test.ts:37
// // [
// //   {
// //     blockHash: '0xada9ff6e1b1839d8756ec2270af92e2beb36bd859fb051c1f67daa86d2603f81',
// //     lock: {
// //       codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
// //       hashType: 'type',
// //       args: '0xedb5c73f2a4ad8df23467c9f3446f5851b5e33da'
// //     },
// //     outPoint: {
// //       txHash: '0xfdf2de9201544017c66f68e841cce9831930fd5251bdb6fdcffb641c30ed6123',
// //       index: '0x0'
// //     },
// //     outputDataLen: '0x0',
// //     capacity: '0x746a528800',
// //     cellbase: false,
// //     type: null
// //   }
// // ]


// // public generateLockHash = (
// //   publicKeyHash: PublicKeyHash,
// //   deps: Omit<DepCellInfo, 'outPoint'> | undefined = this.config.secp256k1Dep,
// // ) => {
// //   if (!deps) {
// //     throw new ArgumentRequired('deps')
// //   }

// //   return this.utils.scriptToHash({
// //     hashType: deps.hashType,
// //     codeHash: deps.codeHash,
// //     args: publicKeyHash,
// //   })
// // }

// // public loadSecp256k1Dep = () => {
// //   const genesisBlock = await this.rpc.getBlockByNumber('0x0')

// //   /* eslint-disable prettier/prettier, no-undef */
// //   const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
// //   const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type
// //   /* eslint-enable prettier/prettier, no-undef */

// //   if (!secp256k1DepTxHash) {
// //     throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
// //   }

// //   if (!typeScript) {
// //     throw new Error('Secp256k1 type script not found')
// //   }

// //   const secp256k1TypeHash = this.utils.scriptToHash(typeScript)

// //   this.config.secp256k1Dep = {
// //     hashType: 'type',
// //     codeHash: secp256k1TypeHash,
// //     outPoint: {
// //       txHash: secp256k1DepTxHash,
// //       index: '0x0',
// //     },
// //   }
// //   return this.config.secp256k1Dep
// // }