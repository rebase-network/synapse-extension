import Axios from 'axios';

export const getTxHistoryByAddress = async (address: string): Promise<any> => {
  const url = 'http://101.200.147.143:2333/cell/getTxHistoryByAddress';
  const result = await Axios.get(`${url}/${address}`);

  return result.data;
};

export default getTxHistoryByAddress;
