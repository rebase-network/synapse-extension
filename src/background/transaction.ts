import Axios, { AxiosRequestConfig } from "axios";

export const getTxHistoryByAddress = async (address: string): Promise<number> => {
  const url = "http://101.200.147.143:2333/cell/getTxHistoryByAddress"
  const result = await Axios.get(url + `/${address}`)

  return result.data;
}
