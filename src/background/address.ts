import Axios, { AxiosRequestConfig } from 'axios';

export const getBalanceByAddress = async (address: string): Promise<number> => {
  // call api
  let url = 'http://101.200.147.143:2333/cell/getBalanceByAddress';
  const result = await Axios.get(url + `/${address}`);
  console.log('result: ', result);
  return result.data;
};
