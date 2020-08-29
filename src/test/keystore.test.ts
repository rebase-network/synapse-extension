import * as Keystore from '../wallet/keystore';

describe('encrypt checkpassword decrypt test', () => {
  const privateKey = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35';
  const password = '123456';
  const keystoreString = {
    version: 3,
    id: '47a83b49-13fe-4bc8-9bf9-f3039fba2bec',
    crypto: {
      ciphertext: 'f7ddbe74497221d28a3a8d6ba0d9f76ef8f2be1d76b7146906034cbee787a28b',
      cipherparams: { iv: 'a2b79c36237e00ce7b6fa6109fce5bfc' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: '237225cf33080c219303d4f07c20b02dbdc48e923f7ec6c800e8669761b692d6',
        n: 262144,
        r: 8,
        p: 1,
      },
      mac: '35107480c8c167e8deb145a308890fdd45de0ea34ebc11fa5a5ee24e4445cba2',
    },
  };

  let keystore;
  let privateKeyDecrypt;
  beforeAll(() => {
    keystore = Keystore.encrypt(Buffer.from(privateKey, 'hex'), password);
    privateKeyDecrypt = Keystore.decrypt(keystoreString, password);
  });

  it('decrypt', () => {
    expect(privateKeyDecrypt).toEqual(privateKey);
  });

  it('checks correct password', async () => {
    expect(Keystore.checkPasswd(keystore, password)).toBe(true);
  });

  it('encrypt decrypt', () => {
    expect(privateKeyDecrypt).toEqual(privateKey);
  });
});
