import { createIndexerByLockHash, getIndexStatusByLockHash } from '@background/indexer.ts';

describe('indexer test', () => {
  const lockHash = '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2';
  const page = BigInt(0);
  const per = BigInt(20);
  const args = '0x9b84887ab2ea170998cff9895675dcd29cd26d4d';

  it.skip('create indexer test', async () => {
    const indexer = await createIndexerByLockHash(lockHash);
    expect(indexer.lockHash).toEqual(lockHash);
  });

  it.skip('get indexer status', async () => {
    const indexerStatus = await getIndexStatusByLockHash(lockHash);
    expect(indexerStatus).toEqual(true);
  });

  //   it.skip('get transaction List', async () => {
  //     const transactionList = await getTransactionsByLockHash(lockHash, page, per);
  //     expect(transactionList.length).toEqual(20);
  //   });

  //   it.skip('parseBlockTxs', async () => {
  //     const transactionList = await getTransactionsByLockHash(lockHash, page, per);
  //     const blockTxs = await parseBlockTxs(transactionList);
  //     console.log(/blockTxs/, JSON.stringify(blockTxs));
  //   });

  //   it('getTxHistories', async () => {
  //     const transactionList = await getTransactionsByLockHash(lockHash, page, per);
  //     const blockTxs = await parseBlockTxs(transactionList);
  //     // const getTxHistoriesResult = await getTxHistories(blockTxs, args);
  //     console.log(/blockTxs/, JSON.stringify(blockTxs));
  //   });
});
