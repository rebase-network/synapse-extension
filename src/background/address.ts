import Axios from 'axios';

export const getBalanceByAddress = async (address: string): Promise<number> => {
  // call api
  const url = 'http://101.200.147.143:2333/cell/getBalanceByAddress';
  const result = await Axios.get(`${url}/${address}`);
  return result.data;
};

export default getBalanceByAddress;
