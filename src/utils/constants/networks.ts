import configService from '@src/config';

export const NETWORK_TYPES = {
  testnet: 'testnet',
  mainnet: 'mainnet',
  local: 'local',
};

export const networks = [
  {
    title: 'Lina Mainnet',
    networkType: NETWORK_TYPES.mainnet,
    prefix: 'ckb',
    nodeURL: configService.CKB_RPC_ENDPOINT_MAINNET,
    cacheURL: configService.CACHE_LAYER_ENDPOINT_MAINNET,
  },
  {
    title: 'Aggron Testnet',
    networkType: NETWORK_TYPES.testnet,
    prefix: 'ckt',
    nodeURL: configService.CKB_RPC_ENDPOINT,
    cacheURL: configService.CACHE_LAYER_ENDPOINT,
  },
  {
    title: 'Local',
    networkType: NETWORK_TYPES.local,
    prefix: 'ckt',
    nodeURL: 'http://127.0.0.1:8114',
    cacheURL: 'http://127.0.0.1:3000',
  },
];
export default networks;
