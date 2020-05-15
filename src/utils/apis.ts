import Axios, { AxiosRequestConfig } from 'axios';
import { Ckb } from './constants';

export const getAddressInfo = async (address: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${Ckb.testnetApiUrl}/address/${address}`);
  console.log('getAddressInfo result: ', result);
  return result.data;
};

export default {
  getAddressInfo,
};
