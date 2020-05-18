import Axios, { AxiosRequestConfig } from 'axios';
import { Ckb } from './constants';

export const getAddressInfo = async (address: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${Ckb.testnetApiUrl}/address/${address}`);
  console.log('getAddressInfo result: ', result);
  return result.data;
};

export const getUnspentCells = async (lockArgs: string)=> {
  const result = await Axios.get(`${Ckb.testnetApiUrl}/cell/getUnspentCells/${lockArgs}`);
  console.log('getUnspentCells result: ', result.data);
  return result.data;
}

export default {
  getAddressInfo,
  getUnspentCells,
};
