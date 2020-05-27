import { getAddressInfo } from '../../utils/apis';
import { configService } from '../../config';
import CKB from '@nervosnetwork/ckb-sdk-core';

// TODO: improve me
window.ckb = {
  rpc: new CKB(configService.CKB_RPC_ENDPOINT),
  getAddressInfo,
  getNetworkInfo: () => ({
    network: 'testnetormainnet',
  }),
  sign: () => {},
  send: () => {},
};

console.log('ckb inject successfully');
