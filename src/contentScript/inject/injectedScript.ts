import { MESSAGE_TYPE } from '@utils/constants';
import { BACKGROUND_PORT, WEB_PAGE } from '@utils/message/constants';

window.ckb = {
  // rpc: new CKB(configService.CKB_RPC_ENDPOINT),
  getAddressInfo: async () => {
    window.postMessage(
      {
        type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
        port: BACKGROUND_PORT,
      },
      '*',
    );
    return new Promise((resolve) => {
      window.addEventListener(
        'message',
        (e) => {
          const message = e.data;
          const isMessageValid = message.type && message.port === WEB_PAGE;
          if (isMessageValid) {
            resolve(message);
          }
        },
        false,
      );
    });
  },
  getLocks: (message: RPCMessage.LocksRequest) => {
    if (message.type !== MESSAGE_TYPE.EXTERNAL_GET_LOCKS) return;
    window.postMessage(message, '*');
  },
  sign: (message: RPCMessage.SignRequest) => {
    if (message.type !== MESSAGE_TYPE.EXTERNAL_SIGN) return;
    window.postMessage(message, '*');
  },
  send: (message: RPCMessage.SignRequest) => {
    if (message.type !== MESSAGE_TYPE.EXTERNAL_SEND) return;
    window.postMessage(message, '*');
  },
  signSend: (message: RPCMessage.SignRequest) => {
    if (message.type !== MESSAGE_TYPE.EXTERNAL_SIGN_SEND) return;
    window.postMessage(message, '*');
  },
};

console.log('ckb is injected successfully');
