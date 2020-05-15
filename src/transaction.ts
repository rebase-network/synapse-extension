import Axios, { AxiosRequestConfig } from 'axios';
import Address, { AddressType, publicKeyToAddress, AddressPrefix } from './wallet/address';
import * as utils from '@nervosnetwork/ckb-sdk-utils';
import { Ckb } from './utils/constants';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(Ckb.remoteRpcUrl);

export const getStatusByTxHash = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  return result.txStatus.status;
};

export const getTxHistoryByAddress = async (address) => {
  let url = 'http://101.200.147.143:2333/cell/getTxHistoryByAddress';
  const result = await Axios.get(url + `/${address}`);
  console.log('result: ', result);
  return result.data;
};

export const inputs = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  return result.transaction.inputs;
};

export const outputs = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  return result.transaction.outputs;
};

//最后一个地址是找零
export const getAmountByTxHash = async (txHash, address) => {
  let result = BigInt(0);
  const outputsData = await outputs(txHash);
  for (var i = 0; i < outputsData.length; i++) {
    const publicKeyHash = outputsData[i].lock.args;
    const addressOutput = utils.bech32Address(publicKeyHash);
    if (!addressOutput.match(address)) {
      result = BigInt(result) + BigInt(outputsData[i].capacity);
    }
  }
  return result;
};

export const getFeeByTxHash = async (txHash) => {
  const inputCapacity0 = await getInputCapacityByTxHash(txHash);
  const outputCapacity0 = await getOutputCapacityByTxHash(txHash);
  const result = inputCapacity0 - outputCapacity0;
  return result;
};

export const getInputAddressByTxHash = async (txHash) => {
  let result = '';
  const inputsData = await inputs(txHash);
  for (var i = 0; i < inputsData.length; i++) {
    const inputTxHash = inputsData[i].previousOutput.txHash;
    const inputIndex = inputsData[i].previousOutput.index;
    let index = new Number(inputIndex);
    const inputAddress = await getOutputAddressByTxHashAndIndex(inputTxHash, index.valueOf());
    result = result + inputAddress + ',';
  }
  result = result.substring(0, result.length - 1);
  return result;
};

export const getInputCapacityByTxHash = async (txHash) => {
  let result = BigInt(0);
  const inputsData = await inputs(txHash);
  for (var i = 0; i < inputsData.length; i++) {
    const inputTxHash = inputsData[i].previousOutput.txHash;
    const inputIndex = inputsData[i].previousOutput.index;
    let index = new Number(inputIndex);
    const inputCapacity = await getInputCapacityByTxHashAndIndex(inputTxHash, index.valueOf());
    result = result + BigInt(inputCapacity);
  }
  return result;
};

export const getInputCapacityByTxHashAndIndex = async (txHash, index) => {
  const outputsData = await outputs(txHash);
  return outputsData[index].capacity;
};

export const getOutputAddressByTxHashAndIndex = async (txHash, index) => {
  const outputsData = await outputs(txHash);
  const publicKeyHash = outputsData[index].lock.args;
  return utils.bech32Address(publicKeyHash);
};

export const getOutputAddressByTxHash = async (txHash) => {
  let result = '';
  const outputsData = await outputs(txHash);
  for (var i = 0; i < outputsData.length; i++) {
    const publicKeyHash = outputsData[i].lock.args;
    result = result + utils.bech32Address(publicKeyHash) + ',';
  }
  result = result.substring(0, result.length - 1);
  return result;
};

export const getOutputCapacityByTxHash = async (txHash) => {
  let result = BigInt(0);
  const outputsData = await outputs(txHash);
  for (var i = 0; i < outputsData.length; i++) {
    result = BigInt(result) + BigInt(outputsData[i].capacity);
  }
  return result;
};

export const getBlockNumberByTxHash = async (txHash) => {
  const result = await ckb.rpc.getTransaction(txHash);
  if(result.txStatus.blockHash == null){
    return BigInt(0);
  }
  const depositBlockHeader = await ckb.rpc
    .getBlock(result.txStatus.blockHash)
    .then((b) => b.header);
  return BigInt(depositBlockHeader.number);
};
