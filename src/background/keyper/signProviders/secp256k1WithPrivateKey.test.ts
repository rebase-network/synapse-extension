import { privateKey, message, signedMessageBeforeSerialize } from '@common/fixtures/tx';
import { sign } from './secp256k1WithPrivateKey';

describe('Sign tx with secp256k1 lock', () => {
  it('sign a tx hash', () => {
    const signedMsg = sign(privateKey, message);
    expect(signedMsg).toBe(signedMessageBeforeSerialize);
  });
});
