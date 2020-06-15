import Axios from 'axios';
import { configService } from '../config';

export const getAddressInfo = async (lockHash: string): Promise<{ capacity: string }> => {
  // call api
  const result = await Axios.get(`${configService.CACHE_LAYER_ENDPOINT}/address/${lockHash}`);
  return result.data;
};

export const getUnspentCells = async (lockHash: string) => {
  // cell/getUnspentCells/:lockHash?isEmpty=true
  const result = await Axios.get(
    `${configService.CACHE_LAYER_ENDPOINT}/cell/getUnspentCells/${lockHash}?isEmpty=true`,
  );

  return result.data;
};

export default {
  getAddressInfo,
  getUnspentCells,
};
