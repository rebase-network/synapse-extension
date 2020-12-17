import { aliceAddresses, aliceWallet } from '@src/tests/fixture/address';
import { encrypt, decrypt } from '../passwordEncryptor';

describe('passwordEncryptor', () => {
  const { privateKey } = aliceAddresses;
  const pwd = '111111';
  it('encrypt', async () => {
    const result = await encrypt(Buffer.from(privateKey), pwd);
    expect(result).toEqual('encrypt');
  });
  it('encrypt', async () => {
    const result = await decrypt(pwd, aliceWallet.keystore);
    expect(result).toEqual('decrypt');
  });
});
