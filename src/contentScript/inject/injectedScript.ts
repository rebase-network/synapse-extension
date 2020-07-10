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
  data?: string;
}

interface SignConfig {
  index: number;
  length: number;
}

interface SignTxMeta {
  config?: SignConfig;
}

interface SignTXRequest {
  tx: CKBComponents.RawTransactionToSign;
  meta: SignTxMeta;
}

interface QueryCellsParams {
  lockHash: string;
  limit?: string;
  hasData?: string;
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

if (typeof window.ckb !== 'undefined') {
  throw new Error('Synapse detected another ckb. Please remove one and try again');
}

window.ckb = {
  // rpc: new CKB(configService.get('CKB_RPC_ENDPOINT')),
  getAddressInfo: async (
    requestMessage: RequestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
      target: BACKGROUND_PORT,
      token: 'getAddressInfoToken',
      requestId: 'getAddressInfoRequestId',
    },
  ) => promisedMessageHandler(requestMessage),

  getLiveCells: async (request: QueryCellsParams) => {
    const requestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_GET_LIVE_CELLS,
      target: BACKGROUND_PORT,
      token: 'getLiveCellsToken',
      requestId: 'getLiveCellsRequestId',
      data: request,
    };

    return promisedMessageHandler(requestMessage);
  },
  // sign tx
  sign: (request: SignTXRequest) => {
    const requestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_SIGN,
      target: BACKGROUND_PORT,
      token: 'signToken',
      requestId: 'signRequestId',
      data: request,
    };

    return promisedMessageHandler(requestMessage);
  },
  // send signed tx
  send: (request: SignTXRequest) => {
    const requestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_SEND,
      target: BACKGROUND_PORT,
      token: 'sendToken',
      requestId: 'sendRequestId',
      data: request,
    };

    return promisedMessageHandler(requestMessage);
  },
  // sign + send
  signSend: (request: SignTXRequest) => {
    const requestMessage = {
      type: MESSAGE_TYPE.EXTERNAL_SIGN_SEND,
      target: BACKGROUND_PORT,
      token: 'signToken',
      requestId: 'signRequestId',
      data: request,
    };

    return promisedMessageHandler(requestMessage);
  },
};

console.log('Synapse: Injected ckb');
