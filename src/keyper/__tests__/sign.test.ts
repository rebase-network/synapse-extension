import { sign } from '@src/keyper/sign';
import { aliceAddresses } from '@src/test/fixture/address';
import { txHash } from './fixture';

describe('Sign tx with secp256k1 lock', () => {
  it('sign with config, index 3, length 2', () => {
    const targetSignMsg =
      '0xd1e172abccec16973df781ec6a4a19b0aa9930be7e8ef9b6b7b43d0bda95b9ac4a271ed96e28164c0d15136be5b0d47a1c087aac76b7ce5b8f36caa095f6794a00';

    const { privateKey } = aliceAddresses;
    const signedMsg = sign(privateKey, txHash);
    expect(signedMsg).toBe(targetSignMsg);
  });
});
