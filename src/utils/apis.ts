import Axios from 'axios';
import configService from '@src/config';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils';
import NetworkManager from '@src/common/networkManager';

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
    console.log('Axios error: ', error);
    // return Promise.reject(error);
    throw error;
  },
);

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  try {
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    const { cacheURL } = currentNetwork;
    const result = await Axios.get(`${cacheURL}/locks/${lockHash}/capacity`);
    if (result.errCode !== 0) {
      return result;
    }
    return result.data;
  } catch (error) {
    console.log('result error', error);
    return error;
  }
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
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    const { cacheURL } = currentNetwork;
    const result = await Axios.get(`${cacheURL}/locks/${lockHash}/cells/unspent`, {
      params,
    });
    if (result.errCode !== 0) {
      return result;
    }
    return result.data;
  } catch (error) {
    console.error('result error', error);
    return error;
  }
};

export const getTxHistories = async (lockHash): Promise<any> => {
  const currentNetwork = await NetworkManager.getCurrentNetwork();
  const { cacheURL } = currentNetwork;
  const url = `${cacheURL}/locks/${lockHash}/txs`;
  const result = await Axios.get(url);

  return result.data;
};

interface TLockAndTypeScripts {
  lockHash: string;
  typeScripts?: CKBComponents.Script[];
}

export const getUDTsByLockHash = async (params: TLockAndTypeScripts): Promise<any> => {
  const currentNetwork = await NetworkManager.getCurrentNetwork();
  const { cacheURL } = currentNetwork;

  const { lockHash } = params;
  const pTypeScripts = params.typeScripts;
  const typeHashes: string[] = [];
  if (pTypeScripts !== undefined) {
    for (let i = 0; i < pTypeScripts.length; i++) {
      const typeScript = pTypeScripts[i];
      const typeHash = scriptToHash(typeScript);
      typeHashes.join(typeHash);
    }
  }
  let url = `${cacheURL}/locks/${lockHash}/tokens`;

  for (let index = 0; index < typeHashes.length; index++) {
    url += `${typeHashes}`;
  }
  const result = await Axios.get(url);
  return result.data;
};

export const getUnspentCapacity = async (lockHash: string) => {
  try {
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    const { cacheURL } = currentNetwork;
    const result = await Axios.get(`${cacheURL}/locks/${lockHash}/capacity`);
    if (result.errCode !== 0) {
      return result;
    }
    return result.data.emptyCapacity;
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
