import { MESSAGE_TYPE } from '../../utils/constants';
import { getAddressInfo } from '../../utils/apis';
import { configService } from '../../config';
import CKB from '@nervosnetwork/ckb-sdk-core';

interface SignPayload {
  message: string;
}
interface SendPayload {
  from?: string;
  to: string;
  capacity: number;
  fee?: number;
}
// TODO: improve me
window.ckb = {
  // rpc: new CKB(configService.CKB_RPC_ENDPOINT),
  // getAddressInfo,
  // sign: (payload: SignPayload) => {
  //   window.postMessage({
  //     messageType: MESSAGE_TYPE.EXTERNAL_SIGN,
  //     payload
  //   }, '*');
  // },
  send: (payload: SendPayload) => {
    window.postMessage(
      {
        messageType: MESSAGE_TYPE.EXTERNAL_SEND,
        payload,
      },
      '*',
    );
  },
};

console.log('ckb is injected successfully');
