import configService from '@src/config';

const CKBOriginal = jest.requireActual('@nervosnetwork/ckb-sdk-core').default;

const CKBOriginalInstance = new CKBOriginal(configService.CKB_RPC_ENDPOINT);

class CKB {
  url: string = '';

  constructor(url) {
    this.url = url;
  }

  rpc: any = {
    sendTransaction: (signedTx) => Promise.resolve(signedTx),
    getLiveCell: () => {
      return {
        cell: {
          data: {
            content: '0x73796e61707365',
            hash: '0xf276b360de7dc210833e8efb1f19927ecd8ff89e94c72d29dc20813fe8368564',
          },
          output: { lock: '[Object]', type: null, capacity: '0x1954fc400' },
        },
        status: 'live',
      };
    },
    getHeaderByNumber: (blockNumber: string) =>
      Promise.resolve({ timestamp: '100', blockNumber, isMock: true }),
    getTransaction: (txHash: string) =>
      Promise.resolve({ isMock: true, transaction: { outputs: [] } }),
  };

  signTransaction = CKBOriginalInstance.signTransaction;
}

export default CKB;
