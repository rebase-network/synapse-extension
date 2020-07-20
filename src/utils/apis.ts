import Axios from 'axios';
import configService from '@src/config';

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
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
  //   const url = `${configService.CACHE_LAYER_ENDPOINT}/cell/getTxHistoriesByIndexer`;
  const url = `${configService.CACHE_LAYER_ENDPOINT}/cell/getTxHistoriesByLockHash`;
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

export const getUnspentCapacity = async (lockHash: string) => {
  try {
    const params = { lockHash };
    const result = await Axios.get(
      `${configService.CACHE_LAYER_ENDPOINT}/cell/getUnspentCapacity/`,
      { params },
    );
    if (result.errCode !== 0) {
      return result;
    }
    return result.data;
  } catch (error) {
    return error;
  }
};

export default {
  getAddressInfo,
  getUnspentCells,
  getTxHistories,
  getUDTsByLockHash,
  getUnspentCapacity,
};
