/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-20 13:18:20
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-21 21:23:23
 */ 
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
