import Axios, { AxiosRequestConfig } from 'axios';
import { Ckb } from './constants';

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${Ckb.testnetApiUrl}/address/${lockHash}`);
  return result.data;
};

export const getUnspentCells = async (lockHash: string) => {
  const result = await Axios.get(
    `${Ckb.testnetApiUrl}/cell/getUnspentCells/${lockHash}`,
  );
  return result.data;
};

export default {
  getAddressInfo,
  getUnspentCells,
};
