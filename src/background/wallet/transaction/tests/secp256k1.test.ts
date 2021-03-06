import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';
import { rawTx } from '@common/fixtures/tx';
import { bobAddresses } from '@src/tests/fixture/address';
import { Secp256k1LockScript as Secp256k1LockScriptOriginal } from '@keyper/container/lib/locks/secp256k1';
import signProvider from '@background/keyper/signProviders/secp256k1';
import { LockScript } from '@keyper/specs';

jest.mock('@common/utils/apis');

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
    const lockScript: LockScript = new Secp256k1LockScriptOriginal();
    lockScript.setProvider(signProvider);

    const expectedTx = {
      ...rawTx,
      witnesses: resultWitnesses,
    };

    const signedTx = ckb.signTransaction(privateKey)(rawTx, []);
    expect(signedTx.witnesses).toEqual(resultWitnesses);
    expect(signedTx).toEqual(expectedTx);
  });
});
