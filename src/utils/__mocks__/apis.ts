// const unspentCells = await getUnspentCells(lockHash);
export const getUnspentCells = async () => {
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

export default {
  getUnspentCells,
  getAddressInfo,
  getTxHistories,
};
