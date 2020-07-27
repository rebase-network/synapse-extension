import configService from '@src/config';
export const networks = [
  {
    title: 'Lina Mainnet',
    networkType: 'mainnet',
    prefix: 'ckb',
    nodeURL: configService.CKB_RPC_ENDPOINT_MAINNET,
    cacheURL: configService.CACHE_LAYER_ENDPOINT_MAINNET,
  },
  {
    title: 'Aggron Testnet',
    networkType: 'testnet',
    prefix: 'ckt',
    nodeURL: configService.CKB_RPC_ENDPOINT,
    cacheURL: configService.CACHE_LAYER_ENDPOINT,
  },
  {
    title: 'local',
    networkType: 'testnet',
    prefix: 'ckt',
    nodeURL: 'http://127.0.0.1:8114',
    cacheURL: 'http://127.0.0.1:3000',
  },
];
export default networks;