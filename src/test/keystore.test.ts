import * as Keystore from '../wallet/keystore';

describe('encrypt checkpassword decrypt test', () => {
  const privateKey = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35';
  const password = '123456';
  const keystoreString = {
    version: 3,
    id: 'a3f4bc4a-d1d7-4ed0-92a5-85263b2337c1',
    crypto: {
      ciphertext: '49c079d4c276f80d68bc265e726307f464d61b53ed55908e8d10e1e570801e34',
      cipherparams: { iv: 'ff16916f29bdcedc5348c539fec9f7b1' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'd28aef7e0b59c2e7c10650c274bf67f3b5c548f3b9507b4892a072138434a407',
        n: 262144,
        r: 8,
        p: 1,
      },
      mac: 'ac1d1c0b7039e6efa3cc0066ecaf43d10a4c0a2c7755c63b048a5576b53cc0ce',
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
