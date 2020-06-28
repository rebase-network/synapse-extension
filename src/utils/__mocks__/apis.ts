// const unspentCells = await getUnspentCells(lockHash);
export const getUnspentCells = async (locakHash?: string) => {
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

export default {
  getUnspentCells,
};
