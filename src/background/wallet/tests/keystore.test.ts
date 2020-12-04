import { bobAddresses, aliceAddresses } from '@src/tests/fixture/address';
import { ExtendedPrivateKey } from '../key';
import * as Keystore from '../keystore';

const fixture = {
  privateKey: aliceAddresses.privateKey,
  chainCode: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
};

describe('load and check password', () => {
  const password = 'hello~!23';
  const keystore = Keystore.encrypt(Buffer.from(aliceAddresses.privateKey), password);

  it('checks wrong password', () => {
    expect(Keystore.checkPasswd(keystore, `oops${password}`)).toBe(false);
  });

  it('checks correct password', () => {
    expect(Keystore.checkPasswd(keystore, password)).toBe(true);
  });

  it('decrypts', () => {
    expect(Keystore.decrypt(keystore, password)).toEqual(
      '307831346366616538346337313666383935393532363334633234306462383062613030623131303332653561633966643136363365336137323333633764383065',
    );
  });
});
