import { MESSAGE_TYPE } from '@utils/constants';
import { BACKGROUND_PORT, WEB_PAGE } from '@utils/message/constants';

interface RequestMessage {
  type: string;
  target: string;
  token: string;
  requestId: string;
}

interface TXMeta {
  from: string;
  to: string;
  capacity: number;
  data: string;
}

interface SignSendTXRequest {
  tx: CKBComponents.RawTransactionToSign;
  meta: TXMeta;
}

const promisedMessageHandler = (requestMessage: RequestMessage) => {
  window.postMessage(requestMessage, '*');

  return new Promise((resolve) => {
    const resultHandler = (e) => {
      const resultMessage = e.data;
      const isMessageValid = resultMessage.type && resultMessage.target === WEB_PAGE;
      if (isMessageValid) {
        window.removeEventListener('resultMessage', resultHandler);
        resolve(resultMessage);
      }
    };
    window.addEventListener('message', resultHandler, false);
  });
};

window.ckb = {
  // rpc: new CKB(configService.CKB_RPC_ENDPOINT),
  getAddressInfo: async (
    requestMessage: RequestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
      target: BACKGROUND_PORT,
      token: 'getAddressInfoToken',
      requestId: 'getAddressInfoRequestId',
    },
  ) => promisedMessageHandler(requestMessage),

  send: (signSendRequest: SignSendTXRequest) => {
    const requestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_SIGN_SEND,
      target: BACKGROUND_PORT,
      token: 'signSendToken',
      requestId: 'signSendRequestId',
      data: {
        tx: signSendRequest.tx,
        target: 'LOCK_HASH',
        config: { index: 0, length: -1 },
        meta: signSendRequest.meta,
      },
    };

    return promisedMessageHandler(requestMessage);
  },
};

console.log('Injected ckb successfully');
