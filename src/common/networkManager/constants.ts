import configService from '@src/config';

export const networks = [
  {
    name: 'Aggron Testnet',
    nodeURL: configService.CKB_RPC_ENDPOINT,
    cacheURL: configService.CACHE_LAYER_ENDPOINT,
    prefix: 'ckt',
  },
  {
    name: 'Local',
    nodeURL: 'http://127.0.0.1:8114',
    cacheURL: 'http://127.0.0.1:3000',
    prefix: 'ckt',
  },
  {
    name: 'Mainnet',
    nodeURL: configService.CKB_RPC_ENDPOINT_MAINNET,
    cacheURL: configService.CACHE_LAYER_ENDPOINT_MAINNET,
    prefix: 'ckb',
  },
];

export default networks;
