// import Address, { AddressType, publicKeyToAddress, AddressPrefix } from '../wallet/address'
// import loadCells from '../wallet/balance/loadCells';
// import {getBalanceByPublicKey} from '../balance';

import * as utils from '@nervosnetwork/ckb-sdk-utils'
import { getStatusByTxHash, getOutputAddressByTxHash, getInputAddressByTxHash, getInputCapacityByTxHash, getFeeByTxHash, getAmountByTxHash } from '../Transaction'
import { getTxHistoryByAddress } from '../Transaction'
import { config } from 'process'

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://106.13.40.34:8114/'
const ckb = new CKB(nodeUrl)

const transaction_hash = "0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead";
const previousOutputHash = "0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2";
const expectTransaction = {
    "transaction": {
        "cellDeps": [
            {
                "outPoint": {
                    "txHash": "0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e",
                    "index": "0x0"
                },
                "depType": "depGroup"
            }
        ],
        "inputs": [
            {
                "previousOutput": {
                    "txHash": "0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2",
                    "index": "0x1"
                },
                "since": "0x0"
            }
        ],
        "outputs": [
            {
                "lock": {
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type",
                    "args": "0xcd09786388eb48e0d1b616d7964945f1a86e9a44"
                },
                "type": null,
                "capacity": "0x746a528800"
            },
            {
                "lock": {
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type",
                    "args": "0x3f1573b44218d4c12a91919a58a863be415a2bc3"
                },
                "type": null,
                "capacity": "0xb897513e30028b7"
            }
        ],
        "outputsData": [
            "0x",
            "0x"
        ],
        "headerDeps": [

        ],
        "hash": "0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead",
        "version": "0x0",
        "witnesses": [
            "0x55000000100000005500000055000000410000003afb8365b489a78d88e5b3cddc856784e251deea0a6e041201b9a73d22e1c0c353141a821b3c119b52272e1b570b0f3be2b461c0477e95aca6d405929ab88ef601"
        ]
    },
    "txStatus": {
        "blockHash": "0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f",
        "status": "committed"
    }
};
const previousOutputTX = {
    "transaction": {
        "cellDeps": [
            {
                "outPoint": {
                    "txHash": "0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e",
                    "index": "0x0"
                },
                "depType": "depGroup"
            }
        ],
        "inputs": [
            {
                "previousOutput": {
                    "txHash": "0xaf63a8d26cb30f7645181bdcb3e8e370616e810f57817aa03da70240c07199f8",
                    "index": "0x1"
                },
                "since": "0x0"
            }
        ],
        "outputs": [
            {
                "lock": {
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type",
                    "args": "0x6760d44c3d9ed372d109309ed180535c7625994b"
                },
                "type": null,
                "capacity": "0x746a528800"
            },
            {
                "lock": {
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type",
                    "args": "0x3f1573b44218d4c12a91919a58a863be415a2bc3"
                },
                "type": null,
                "capacity": "0xb8975884d52b2eb"
            }
        ],
        "outputsData": [
            "0x",
            "0x"
        ],
        "headerDeps": [

        ],
        "hash": "0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2",
        "version": "0x0",
        "witnesses": [
            "0x5500000010000000550000005500000041000000fd079be56223be0661a6d5bbe34ad2f3820975000391b301b9ab994a5e0d767910e40cadbb2fd66ae1daf8d196a10afd77856daf643a6b0012b889c7fc71080301"
        ]
    },
    "txStatus": {
        "blockHash": "0xf939f366beb749cdb95c7b6c719c800f49d0be25ab4a29043884fc5e763e20ad",
        "status": "committed"
    }
}

const expectBlockHash = "0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f";
const expectStatus = "committed";
const expectlockHash = "0x9cb0bfa5cc9d53775c677c6e4f35e90bd8a65923fb691f1895455cb48f0241f1";


describe('transaction test', () => {

    it('1- get transaction by Hash of a transaction', async () => {

        const result = await ckb.rpc.getTransaction(transaction_hash);
        expect(result).toEqual(expectTransaction);
    })

    it('11- get transaction by Hash of a transaction', async () => {

        const result = await ckb.rpc.getTransaction(previousOutputHash);
        // console.log(JSON.stringify(result));
        expect(result).toEqual(previousOutputTX);
    })

    it('2- get BlockHash by Hash of a transaction', async () => {

        const result = await ckb.rpc.getTransaction(transaction_hash);
        expect(result.txStatus.blockHash).toEqual(expectBlockHash);
    })

    //   tx => {
    //     inputs: [Function (anonymous)],
    //     outputs: [Function (anonymous)],
    //     txStatus: [Function (anonymous)],
    //     getStatusByTxHash: [Function (anonymous)],
    //     getAmountByTxHash: [Function (anonymous)],
    //     getFeeByTxHash: [Function (anonymous)],
    //     getInputByTxHash: [Function (anonymous)],
    //     getOutputByTxHash: [Function (anonymous)],
    //     getBlockNumberByTxHash: [Function (anonymous)]
    //   }
    it('3- get status by Hash of a transaction', async () => {

        // const result = await ckb.rpc.getTransaction(transaction_hash);
        const status = await getStatusByTxHash(transaction_hash)
        expect(status).toEqual(expectStatus);
    })

    it('4- get transaction_hash by Hash of a transaction', async () => {

        const result = await ckb.rpc.getTransaction(transaction_hash);
        expect(result.transaction.hash).toEqual(transaction_hash);
    })


    //   it('5- generate lock hash',async () => {

    //     const publicKeyHash = "0xcd09786388eb48e0d1b616d7964945f1a86e9a44";
    //     const hashType = "type";
    //     const codeHash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8";

    //     const lockHash = utils.scriptToHash({
    //         hashType: hashType,
    //         codeHash: codeHash,
    //         args: publicKeyHash,
    //       })
    //     // console.log("lockHash => ", lockHash);
    //     expect(lockHash).toEqual(expectlockHash);
    //   })  

    it('6- get ouputs address by publicKeyHash', async () => {
        // cellStatus.cell.output.lock.args = publicKeyHash
        // const to0 = utils.bech32Address("0xcd09786388eb48e0d1b616d7964945f1a86e9a44");
        // expect(to0).toEqual("ckt1qyqv6ztcvwywkj8q6xmpd4ukf9zlr2rwnfzq4s7eek");

        // const to1 = utils.bech32Address("0x3f1573b44218d4c12a91919a58a863be415a2bc3");
        // expect(to1).toEqual("ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70");
        const to0 = "ckt1qyqv6ztcvwywkj8q6xmpd4ukf9zlr2rwnfzq4s7eek";
        const to1 = "ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70";
        const toAddress = await getOutputAddressByTxHash(transaction_hash);
        expect(to0).toEqual(toAddress.split(",")[0]);
        expect(to1).toEqual(toAddress.split(",")[1]);
        // expect(toAddress).toEqual(to0 + "," + to1);

    })

    it('7- get inputs address by publicKeyHash', async () => {
        // cellStatus.cell.output.lock.args = publicKeyHash
        // const from0 = utils.bech32Address("0x3f1573b44218d4c12a91919a58a863be415a2bc3");
        // expect(from0).toEqual("ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70");
        const fromAddress = await getInputAddressByTxHash(transaction_hash);
        const from0 = "ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70";
        expect(from0).toEqual(fromAddress.split(",")[0]);

    })

    it('8- get input Capacity by transaction_hash', async () => {
        // const expectCapacity = BigInt(500000000000);
        // const result = await ckb.rpc.getTransaction(transaction_hash);
        // const outputs = result.transaction.outputs;
        // const outputs = tx.outputs(transaction_hash);
        // const tradeCapacity = outputs[0].capacity;
        // expect(BigInt(tradeCapacity)).toEqual(expectCapacity);
        // let bar: bigint = 100n; 
        //ERROR
        const expectCapacity_8 = "831324834499834603";
        const inputsCapacity_8 = await getInputCapacityByTxHash(transaction_hash);
        // console.log(BigInt(inputsCapacity_8)); //831324834499834603n
        expect(expectCapacity_8).toEqual(inputsCapacity_8.toString());

    })

    //    it('8- get trade Capacity by transaction_hash',async () => {
    //         const expectCapacity = BigInt(500000000000);
    //         // const result = await ckb.rpc.getTransaction(transaction_hash);
    //         // const outputs = result.transaction.outputs;
    //         const outputs = tx.outputs(transaction_hash);
    //         const tradeCapacity = outputs[0].capacity;
    //         expect(BigInt(tradeCapacity)).toEqual(expectCapacity);
    //    }) 

    //    const inputsCapacity = async (txHash,index) => {
    //         const result = await ckb.rpc.getTransaction(txHash);
    //         const outputs = result.transaction.outputs; 
    //         let number = new Number(index);
    //         // console.log("inputsCapacity =>", number.valueOf());
    //         return BigInt(outputs[number.valueOf()].capacity); 
    //    }

    it('90- get Amount fee by publicKeyHash', async () => {
        const expectFee = BigInt(500000000000);
        const amount = await getAmountByTxHash(transaction_hash, "ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70");
        // console.log(amount);//500000000000n
        expect(expectFee).toEqual(amount);
    })

    it('91- get trade fee by publicKeyHash', async () => {
        //001
        // const expectFee:Number = new Number(564);
        // const result = await ckb.rpc.getTransaction(transaction_hash);
        // const inputs = result.transaction.inputs;
        // let txHash = "";
        // let index = BigInt(0);
        // let inputsCap = BigInt(0);
        // for (var i = 0; i < inputs.length; i ++) {
        //     let outputsCap = BigInt(0);
        //     txHash = inputs[i].previousOutput.txHash;
        //     index = inputs[i].previousOutput.index;
        //     // console.log("txHash index =>",txHash, index);
        //     outputsCap = await inputsCapacity(txHash,index);
        //     inputsCap = inputsCap + outputsCap;
        // }
        // // console.log("inputsCap =>", inputsCap);

        // let outputsCap = BigInt(0);
        // const outputs = result.transaction.outputs;
        // for (var i = 0; i < outputs.length; i ++) {
        //     console.log(BigInt(outputs[i].capacity));  
        //     outputsCap = BigInt(outputsCap) + BigInt(outputs[i].capacity);
        // }
        // // console.log("outputsCap =>", outputsCap);  

        // let fee = new Number(inputsCap - outputsCap);
        // console.log("fee =>",fee.valueOf());
        // expect(expectFee).toEqual(fee);
        //002
        const expectFee: Number = new Number(564);
        const fee = await getFeeByTxHash(transaction_hash);
        let feeNumber = new Number(fee);
        expect(expectFee).toEqual(feeNumber);
    })

    //    const blockHeader = {"compactTarget":"0x1d39bbb1","parentHash":"0x85a05ac12a2ad25d54bb651d90c2da40d237f8cd8fcba3a3172321c13a3cc9b2","transactionsRoot":"0xceff4f4ed6e34bf306dc26bcbf69919bc72e743c9dad6f52f9544a30296f7455","proposalsHash":"0x0000000000000000000000000000000000000000000000000000000000000000","unclesHash":"0x3532a26e91f64bd8cd9367754c320c3d19d809b1dad778839d324f9dfff94d86","dao":"0x601d55eab4cbea2e7ae4421486942300b15a4ab6852f0f000087ce469ed80307","epoch":"0x27c0249000051","hash":"0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f","nonce":"0x71436636729d3b91b0747f3b049ee330","number":"0xeb18","timestamp":"0x1714e40506f","version":"0x0"}
    // //    const blockNumber = "0x18eb"; //60,184
    //    const blockNumber = "60184"
    //    it('10- get block ',async () => {
    //         const result = await ckb.rpc.getTransaction(transaction_hash);
    //         // const Blockhash = result.txStatus.blockHash;
    //         const depositBlockHeader = await ckb.rpc.getBlock(result.txStatus.blockHash).then(b => b.header);
    //         console.log(JSON.stringify(depositBlockHeader));
    //         expect(depositBlockHeader).toEqual(blockHeader);
    //         console.log(BigInt(depositBlockHeader.number));
    //         // const encodedBlockNumber = utils.toHexInLittleEndian(depositBlockHeader.number, 8)
    //         // console.log(encodedBlockNumber);
    //         // expect(BigInt(encodedBlockNumber)).toEqual(BigInt(blockNumber));
    //         // const tradeCapacity = outputs[0].capacity;
    //         expect(BigInt(depositBlockHeader.number)).toEqual(BigInt(blockNumber));
    //     }) 
})



// await ckb.loadSecp256k1Dep();
// const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)


// {
//   "transaction":{
//       "cellDeps":[
//           {
//               "outPoint":{
//                   "txHash":"0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e",
//                   "index":"0x0"
//               },
//               "depType":"depGroup"
//           }
//       ],
//       "inputs":[
//           {
//               "previousOutput":{
//                   "txHash":"0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2",
//                   "index":"0x1"
//               },
//               "since":"0x0"
//           }
//       ],
//       "outputs":[
//           {
//               "lock":{
//                   "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
//                   "hashType":"type",
//                   "args":"0xcd09786388eb48e0d1b616d7964945f1a86e9a44"
//               },
//               "type":null,
//               "capacity":"0x746a528800"
//           },
//           {
//               "lock":{
//                   "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
//                   "hashType":"type",
//                   "args":"0x3f1573b44218d4c12a91919a58a863be415a2bc3"
//               },
//               "type":null,
//               "capacity":"0xb897513e30028b7"
//           }
//       ],
//       "outputsData":[
//           "0x",
//           "0x"
//       ],
//       "headerDeps":[

//       ],
//       "hash":"0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead",
//       "version":"0x0",
//       "witnesses":[
//           "0x55000000100000005500000055000000410000003afb8365b489a78d88e5b3cddc856784e251deea0a6e041201b9a73d22e1c0c353141a821b3c119b52272e1b570b0f3be2b461c0477e95aca6d405929ab88ef601"
//       ]
//   },
//   "txStatus":{
//       "blockHash":"0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f",
//       "status":"committed"
//   }
// }

describe('transaction history', () => {
    it('get tx history by address', async () => {
        const addr1 = "ckt1qyqd5eyygtdmwdr7ge736zw6z0ju6wsw7rssu8fcve"

        const result1 = await getTxHistoryByAddress(addr1)
        expect(result1.length).toBe(15)
    })

})
