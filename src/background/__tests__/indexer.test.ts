import { createIndexerByLockHash, getIndexStatusByLockHash } from '@background/indexer.ts';

describe('indexer test', () => {
  const lockHash = '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2';

  it('create indexer test', async () => {
    const indexer = await createIndexerByLockHash(lockHash);
    expect(indexer.lockHash).toEqual(lockHash);
  });

  it('get indexer status', async () => {
    const indexerStatus = await getIndexStatusByLockHash(lockHash);
    expect(indexerStatus).toEqual(true);
  });
});
