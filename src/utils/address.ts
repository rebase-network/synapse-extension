import Axios, { AxiosRequestConfig } from "axios";

export const getBalanceByAddress = async (address: string): Promise<number> => {
  // call api
  const result = await Axios.get(`http://localhost:3000/cell/getBalanceByAddress/${address}`);
  console.log('result: ', result)
  return result.data;
}