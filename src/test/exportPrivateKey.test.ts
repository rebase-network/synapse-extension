import Keystore from './keystore';
import Keychain from '../wallet/keychain';
import { ExtendedPrivateKey } from '../wallet/key';

describe('export privateKey or Keystore', () => {
  const keystoreString =
    '{"version":3,"crypto":{"ciphertext":"6ce0024645d3f6accdae141e9911826b3743bcab32691a611f84040ba86e010d5acb82f7d0307dee87d51c00d08b0c2ff540d5836d34d6d4861af17fd3748e11","cipherparams":{"iv":"7d0dfd85ae8834e3d693a42798747a54"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"9b4d20b6bad3f29cd6095eb586523879188c97f11d41006d2daa659c6dced340","n":262144,"r":8,"p":1},"mac":"398ca21b017c68bdd118c133f4e85bf3819845af1f6849354b330c08616c3a57"},"id":"ac42c0fc-fc31-4367-b510-dda64948989b"}';
  const password = '123456';
  const expextPrivateKey = '0x1f78d67849d9503c6f21e1432383501dabac78e7f7eb5c51a5f7f2470bd97c42';

  const fixture = {
    privateKey: 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
    publicKey: '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2',
    chainCode: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
  };

  const fixture02 = {
    privateKey: '72cfb75b2e1936e660be797bd2ddfeeeacb682d8e0bd2ff6c2c62eab255f09da',
    chainCode: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed3eeeee',
  };

  it('01- export keystore by passwrod', () => {
    const keystore = Keystore.fromJson(keystoreString);
    expect(keystore.checkPassword(password)).toBe(true);
  });

  it('02- export privateKey by keystore and password', () => {
    const keystore = Keystore.fromJson(keystoreString); //参数是String
    const masterPrivateKey = keystore.extendedPrivateKey(password);
    const masterKeychain = new Keychain(
      Buffer.from(masterPrivateKey.privateKey, 'hex'),
      Buffer.from(masterPrivateKey.chainCode, 'hex'),
    );
    const privateKey =
      '0x' +
      masterKeychain.derivePath(`m/44'/309'/0'/0`).deriveChild(0, false).privateKey.toString('hex');
    expect(expextPrivateKey).toEqual(privateKey);
  });

  it('03- create keystore by private and password', () => {
    const password = '12345678';
    const keystore = Keystore.create(
      new ExtendedPrivateKey(fixture.privateKey, fixture.chainCode),
      password,
    );
    // console.log("keystore =>", keystore);

    //get password by Keystore
    const extendedPrivateKey = keystore.extendedPrivateKey(password);
    expect(extendedPrivateKey.privateKey).toEqual(fixture.privateKey);
  });

  it('04- create keystore by private and password', () => {
    const password = '12345678';
    const keystore = Keystore.create(
      new ExtendedPrivateKey(fixture02.privateKey, fixture02.chainCode),
      password,
    );
    // console.log("keystore =>", keystore);

    //get password by Keystore
    const extendedPrivateKey = keystore.extendedPrivateKey(password);
    expect(extendedPrivateKey.privateKey).toEqual(fixture02.privateKey);
  });
});
