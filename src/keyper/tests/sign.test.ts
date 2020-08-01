import { sign } from '@src/keyper/sign';
import signInfo from './fixtures/signInfo';

describe('Sign tx with secp256k1 lock', () => {
  it('sign a tx hash', () => {
    const { privateKey, message, signedMessage } = signInfo;

    const signedMsg = sign(privateKey, message);
    expect(signedMsg).toBe(signedMessage);
  });
});
