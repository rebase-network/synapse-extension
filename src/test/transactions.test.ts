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

import {
import { configService } from '../config';
  transactionHash,
  previousOutputHash,
  expectTransaction,
  previousOutputTX,
  expectBlockHash,
  expectStatus,
  expectlockHash,
} from './fixture';

describe('transaction test', () => {
  it('1- get transaction by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transactionHash);
    expect(result).toEqual(expectTransaction);
  });

  it('11- get transaction by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(previousOutputHash);
    expect(result).toEqual(previousOutputTX);
  });

  it('2- get BlockHash by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transactionHash);
    expect(result.txStatus.blockHash).toEqual(expectBlockHash);
  });

  it('3- get status by Hash of a transaction', async () => {
    const status = await getStatusByTxHash(transactionHash);
    expect(status).toEqual(expectStatus);
  });

  it('4- get transactionHash by Hash of a transaction', async () => {
    const result = await ckb.rpc.getTransaction(transactionHash);
    expect(result.transaction.hash).toEqual(transactionHash);
  });

  it('6- get ouputs address by publicKeyHash', async () => {
    const to0 = 'ckt1qyqv6ztcvwywkj8q6xmpd4ukf9zlr2rwnfzq4s7eek';
    const to1 = 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70';
    const toAddress = await getOutputAddressByTxHash(transactionHash);
    expect(to0).toEqual(toAddress.split(',')[0]);
    expect(to1).toEqual(toAddress.split(',')[1]);
  });

  it('7- get inputs address by publicKeyHash', async () => {
    const fromAddress = await getInputAddressByTxHash(transactionHash);
    const from0 = 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70';
    expect(from0).toEqual(fromAddress.split(',')[0]);
  });

  it('8- get input Capacity by transactionHash', async () => {
    //ERROR
    const expectCapacity_8 = '831324834499834603';
    const inputsCapacity_8 = await getInputCapacityByTxHash(transactionHash);
    expect(expectCapacity_8).toEqual(inputsCapacity_8.toString());
  });

  it('90- get Amount fee by publicKeyHash', async () => {
    const expectFee = BigInt(500000000000);
    const amount = await getAmountByTxHash(
      transactionHash,
      'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70',
    );
    expect(expectFee).toEqual(amount);
  });

  it('91- get trade fee by publicKeyHash', async () => {
    const expectFee: Number = new Number(564);
    const fee = await getFeeByTxHash(transactionHash);
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
