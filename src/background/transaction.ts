import Axios, { AxiosRequestConfig } from 'axios';
import { Ckb } from '../utils/constants';

export const getTxHistoryByAddress = async (address: string): Promise<any> => {
  const url = `${Ckb.testnetApiUrl}/cell/getTxHistoryByAddress`;
  const result = await Axios.get(url + `/${address}`);

  return result.data;
};
