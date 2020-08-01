import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';
import { rawTx, signedWitnesses } from '@common/fixtures/tx';
import { bobAddresses, aliceAddresses } from '@src/test/fixture/address';
import { secp256k1Dep } from '@src/test/fixture/deps';
import { signTx } from '@src/keyper/keyperwallet';

jest.mock('@utils/apis');

const resultWitnesses = [
  '0x5500000010000000550000005500000041000000ffac752f9a4da6fc3069dd8bea3caf8e8b687040e28d2ed1d71f0f32713e87b0380902cabdad79caaf7931d48ae2ee7db370e456c0546633a6d887e2f16d402d00',
  '0x10000000100000001000000010000000',
  '0x10000000100000001000000010000000',
  '0x10000000100000001000000010000000',
  '0x10000000100000001000000010000000',
];

describe('Transaction test: secp256k1', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('should be able to sign tx with secp256k1', async () => {
    const { privateKey } = bobAddresses;

    // console.log('--- createRawTx tx ---', JSON.stringify(rawTx));

    const expectedTx = {
      ...rawTx,
      witnesses: resultWitnesses,
    };

    const signedTx = ckb.signTransaction(privateKey)(rawTx, []);
    expect(signedTx.witnesses).toEqual(resultWitnesses);
    expect(signedTx).toEqual(expectedTx);
    // console.log('signedTx: ', JSON.stringify(signedTx));

    const privKey = 'xxxxx';
    const signedTxAgain = ckb.signTransaction(privKey)(rawTx, []);
    // const expectedTxAgain = {
    //   ...rawTx,
    //   witnesses: signedWitnesses,
    // };
    expect(signedTxAgain.witnesses[3]).toEqual(signedWitnesses[3]);
  });
});
