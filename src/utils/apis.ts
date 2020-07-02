import Axios from 'axios';
import { configService } from '../config';

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  },
);

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${configService.CACHE_LAYER_ENDPOINT}/address/${lockHash}`);
  return result.data;
};

export const getUnspentCells = async (lockHash: string, isEmpty = true, capacity = 62) => {
  // cell/getUnspentCells/:lockHash?isEmpty=true
  const result = await Axios.get(
    `${configService.CACHE_LAYER_ENDPOINT}/cell/getUnspentCells/${lockHash}?isEmpty=${isEmpty}&capacity=${capacity}`,
  );

  return result.data;
};

export const getTxHistories = async (scriptObj): Promise<any> => {
  const url = `${configService.CACHE_LAYER_ENDPOINT}/cell/getTxHistoriesByIndexer`;
  const result = await Axios.post(url, scriptObj);
  return result.data;
};

interface TLockAndTypeScripts {
  lockHash: string;
  typeScripts?: CKBComponents.Script[];
}

export const getUDTsByLockHash = async (params: TLockAndTypeScripts): Promise<any> => {
  const url = `${configService.CACHE_LAYER_ENDPOINT}/cell/getCellsByLockHashAndTypeScripts`;

  const result = await Axios.post(url, params);
  return result.data;
};

export default {
  getAddressInfo,
  getUnspentCells,
  getTxHistories,
  getUDTsByLockHash,
};
