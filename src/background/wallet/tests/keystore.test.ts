import { aliceAddresses } from '@src/tests/fixture/address';
import * as Keystore from '../keystore';

const enum KDFFunctions {
  PBKDF = 'pbkdf2',
  Scrypt = 'scrypt',
}

describe('load and check password', () => {
  const password = 'hello~!23';
  const keystore = Keystore.encrypt(Buffer.from(aliceAddresses.privateKey), password);
  const keystoreKDF = Keystore.encrypt(Buffer.from(aliceAddresses.privateKey), password, {
    kdf: KDFFunctions.PBKDF,
  });

  it('decrypts', () => {
    expect(Keystore.decrypt(keystore, password)).toEqual(
      '307831346366616538346337313666383935393532363334633234306462383062613030623131303332653561633966643136363365336137323333633764383065',
    );
  });

  it('decrypts json', () => {
    expect(Keystore.decrypt(keystoreKDF, password)).toEqual(
      '307831346366616538346337313666383935393532363334633234306462383062613030623131303332653561633966643136363365336137323333633764383065',
    );
  });

  it('checks wrong password for scrypt', () => {
    expect(Keystore.checkPasswd(keystore, `oops${password}`)).toBe(false);
  });

  it('checks correct password for scrypt', () => {
    expect(Keystore.checkPasswd(keystore, password)).toBe(true);
  });

  it('checks wrong password for pbkdf2', () => {
    expect(Keystore.checkPasswd(keystoreKDF, `oops${password}`)).toBe(false);
  });

  it('checks correct password for pbkdf2', () => {
    expect(Keystore.checkPasswd(keystoreKDF, password)).toBe(true);
  });

  it('checks scrypt password for error', () => {
    const keystoreNothing = keystore;
    keystoreNothing.crypto.kdf = '123';
    expect(() => Keystore.checkPasswd(keystoreNothing, password)).toThrow();
  });

  it('checks version', () => {
    const keystoreNothing = keystore;
    keystoreNothing.version = 2;
    expect(() => Keystore.checkPasswd(keystoreNothing, password)).toThrow();
  });

  it('checks kdf password for error', () => {
    const keystoreNothing = keystoreKDF;
    keystoreNothing.crypto.kdfparams = {
      dklen: 32,
      salt: '6c849a1d5040e8fa031eb5e4bcab6db00f18e00408afc02ac1464a237b879af0',
      c: 262144,
      prf: 'hmac-sha512',
    };
    expect(() => Keystore.checkPasswd(keystoreNothing, password)).toThrow();
  });
});
