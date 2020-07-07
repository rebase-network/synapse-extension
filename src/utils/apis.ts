import Axios from 'axios';
import { configService } from '../config';

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    // console.log('response', response);
    // Do something with response data
    // const result = response.data;
    // if (result.errCode !== 0) {
    //   console.log(/axios result error/, JSON.stringify(result));
    // }
    return response.data;
  },
  (error) => {
    // Do something with response error
    console.log('Axios error : ===> ', error);
    // return Promise.reject(error);
    throw error;
  },
);

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${configService.CACHE_LAYER_ENDPOINT}/address/${lockHash}`);
  return result.data;
};

export interface UnspentCellsParams {
  //   lockHash: string;
  limit?: string;
  typeHash?: string;
  capacity?: string;
  hasData?: string;
}

// https://github.com/rebase-network/ckb-cache-layer/blob/master/doc.md
export const getUnspentCells = async (
  lockHash: string,
  { limit, typeHash, capacity, hasData }: UnspentCellsParams,
) => {
  const params = {
    lockHash,
    limit,
    typeHash,
    capacity,
    hasData,
  };
  try {
    const result = await Axios.get(`${configService.CACHE_LAYER_ENDPOINT}/cell/getUnspentCells/`, {
      params,
    });
    if (result.errCode !== 0) {
      console.log(/result error/, JSON.stringify(result));
      return result;
    }
    return result.data;
  } catch (error) {
    console.log('result error', error);
    return error;
  }
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
