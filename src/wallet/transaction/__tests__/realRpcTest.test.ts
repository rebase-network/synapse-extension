import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Transaction test', async () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('test getTransaction', async () => {
    const txDetail = await ckb.rpc.getTransaction(
      '0xff3f9ded461b569789d8e8cf291c4b9e625472c92a99b229643294ef18b6316a',
    );
    console.log('txObj', JSON.stringify(txDetail));
  });
});
