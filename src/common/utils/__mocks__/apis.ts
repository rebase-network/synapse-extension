import { udtUnspentCells, getUDTsByLockHashFixture } from '../fixtures/apis';

// const unspentCells = await getUnspentCells(lockHash);
export const getUnspentCells = async (lockHash, params) => {
  if (lockHash || params) return udtUnspentCells;
  const result = [
    {
      capacity: 100,
    },
    {
      capacity: 200,
    },
  ];
  return Promise.resolve(result);
};

export const getAddressInfo = () => Promise.resolve({ capacity: '0x01' });

export const getTxHistories = () => Promise.resolve([]);

export const getUDTsByLockHash = () => Promise.resolve(getUDTsByLockHashFixture);

export const getUnspentCapacity = () => Promise.resolve([]);

export default {
  getAddressInfo,
  getUnspentCells,
  getTxHistories,
  getUDTsByLockHash,
  getUnspentCapacity,
};
