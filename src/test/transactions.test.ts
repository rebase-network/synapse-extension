import {
  getStatusByTxHash,
  getOutputAddressByTxHash,
  getInputAddressByTxHash,
  getInputCapacityByTxHash,
  getFeeByTxHash,
  getAmountByTxHash,
} from '../transaction_del';
import { getTxHistoryByAddress } from '../transaction_del';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const nodeUrl = 'http://101.200.147.143:8117/';
const ckb = new CKB(nodeUrl);

const transaction_hash = '0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead';
const previousOutputHash = '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2';
const expectTransaction = {
  transaction: {
    cellDeps: [
      {
        outPoint: {
          txHash: '0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e',
          index: '0x0',
        },
        depType: 'depGroup',
      },
    ],
    inputs: [
      {
        previousOutput: {
          txHash: '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2',
          index: '0x1',
        },
        since: '0x0',
      },
    ],
    outputs: [
      {
        lock: {
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hashType: 'type',
          args: '0xcd09786388eb48e0d1b616d7964945f1a86e9a44',
        },
        type: null,
        capacity: '0x746a528800',
      },
      {
        lock: {
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hashType: 'type',
          args: '0x3f1573b44218d4c12a91919a58a863be415a2bc3',
        },
        type: null,
        capacity: '0xb897513e30028b7',
      },
    ],
    outputsData: ['0x', '0x'],
    headerDeps: [],
    hash: '0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead',
    version: '0x0',
    witnesses: [
      '0x55000000100000005500000055000000410000003afb8365b489a78d88e5b3cddc856784e251deea0a6e041201b9a73d22e1c0c353141a821b3c119b52272e1b570b0f3be2b461c0477e95aca6d405929ab88ef601',
    ],
  },
  txStatus: {
    blockHash: '0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f',
    status: 'committed',
  },
};
const previousOutputTX = {
  transaction: {
    cellDeps: [
      {
        outPoint: {
          txHash: '0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e',
          index: '0x0',
        },
        depType: 'depGroup',
      },
    ],
    inputs: [
      {
        previousOutput: {
          txHash: '0xaf63a8d26cb30f7645181bdcb3e8e370616e810f57817aa03da70240c07199f8',
          index: '0x1',
        },
        since: '0x0',
      },
    ],
    outputs: [
      {
        lock: {
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hashType: 'type',
          args: '0x6760d44c3d9ed372d109309ed180535c7625994b',
        },
        type: null,
        capacity: '0x746a528800',
      },
      {
        lock: {
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hashType: 'type',
          args: '0x3f1573b44218d4c12a91919a58a863be415a2bc3',
        },
        type: null,
        capacity: '0xb8975884d52b2eb',
      },
    ],
    outputsData: ['0x', '0x'],
    headerDeps: [],
    hash: '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2',
    version: '0x0',
    witnesses: [
      '0x5500000010000000550000005500000041000000fd079be56223be0661a6d5bbe34ad2f3820975000391b301b9ab994a5e0d767910e40cadbb2fd66ae1daf8d196a10afd77856daf643a6b0012b889c7fc71080301',
    ],
  },
  txStatus: {
    blockHash: '0xf939f366beb749cdb95c7b6c719c800f49d0be25ab4a29043884fc5e763e20ad',
    status: 'committed',
  },
};

const expectBlockHash = '0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f';
const expectStatus = 'committed';
const expectlockHash = '0x9cb0bfa5cc9d53775c677c6e4f35e90bd8a65923fb691f1895455cb48f0241f1';

describe('transaction test', () => {
  it('1- get transaction by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transaction_hash);
    expect(result).toEqual(expectTransaction);
  });

  it('11- get transaction by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(previousOutputHash);
    expect(result).toEqual(previousOutputTX);
  });

  it('2- get BlockHash by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transaction_hash);
    expect(result.txStatus.blockHash).toEqual(expectBlockHash);
  });

  it('3- get status by Hash of a transaction', async () => {
    const status = await getStatusByTxHash(transaction_hash);
    expect(status).toEqual(expectStatus);
  });

  it('4- get transaction_hash by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transaction_hash);
    expect(result.transaction.hash).toEqual(transaction_hash);
  });

  it('6- get ouputs address by publicKeyHash', async () => {
    const to0 = 'ckt1qyqv6ztcvwywkj8q6xmpd4ukf9zlr2rwnfzq4s7eek';
    const to1 = 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70';
    const toAddress = await getOutputAddressByTxHash(transaction_hash);
    expect(to0).toEqual(toAddress.split(',')[0]);
    expect(to1).toEqual(toAddress.split(',')[1]);
  });

  it('7- get inputs address by publicKeyHash', async () => {
    const fromAddress = await getInputAddressByTxHash(transaction_hash);
    const from0 = 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70';
    expect(from0).toEqual(fromAddress.split(',')[0]);
  });

  it('8- get input Capacity by transaction_hash', async () => {
    //ERROR
    const expectCapacity_8 = '831324834499834603';
    const inputsCapacity_8 = await getInputCapacityByTxHash(transaction_hash);
    expect(expectCapacity_8).toEqual(inputsCapacity_8.toString());
  });

  it('90- get Amount fee by publicKeyHash', async () => {
    const expectFee = BigInt(500000000000);
    const amount = await getAmountByTxHash(
      transaction_hash,
      'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70',
    );
    expect(expectFee).toEqual(amount);
  });

  it('91- get trade fee by publicKeyHash', async () => {
    const expectFee: Number = new Number(564);
    const fee = await getFeeByTxHash(transaction_hash);
    let feeNumber = new Number(fee);
    expect(expectFee).toEqual(feeNumber);
  });
});

describe('transaction history', () => {
  it('get tx history by address', async () => {
    const addr1 = 'ckt1qyqd5eyygtdmwdr7ge736zw6z0ju6wsw7rssu8fcve';

    const result1 = await getTxHistoryByAddress(addr1);
    expect(result1.length).toBe(15);
  });
});
