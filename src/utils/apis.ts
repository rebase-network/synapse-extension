import Axios, { AxiosRequestConfig } from 'axios';
import { Ckb } from './constants';

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${Ckb.testnetApiUrl}/address/${lockHash}`);
  console.log('getAddressInfo result: ', result.data);
  return result.data;
};

export const getUnspentCells = async (lockHash: string, lockScript) => {
  const searchParams = `lockArgs=${lockScript.args}&lockCodeHash=${lockScript.codeHash}&lockHashType=${lockScript.hashType}`;
  const result = await Axios.get(
    `${Ckb.testnetApiUrl}/cell/getUnspentCells/${lockHash}?${searchParams}`,
  );
  console.log('getUnspentCells result: ', result.data);
  return result.data;
};

export default {
  getAddressInfo,
  getUnspentCells,
};
