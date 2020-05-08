import { ExtendedPrivateKey } from '../wallet/key';
import Keystore from '../wallet/keystore';
import Keychain from '../wallet/keychain';

// const fixture = {
//   privateKey: 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
//   publicKey: '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2',
//   chainCode: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
// }

const keystoreString =
  '{"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"e840e0b45f43f17b819078f5728773cb"},"ciphertext":"9bb7ae63b5dab2afabccec3ea0779e11ccd6b3325b57f7242757d5e53ab81c6cf3cd593047d38004a9d523954e78663dbf7e277c035c5cc2cde4946e8313eede","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"b3d734f2458f2dfc32ea05c2a50bbefa98e04238767f50b96a6ed406006754ab"},"mac":"1102b5ca13cd4c70bec722ca4a48b286915e5a66e886e3630dc1cbdf408503e3"},"id":"7f4e7ff6-3e76-47e5-a631-45b25cf3a5a5","version":3}';

describe('load ckb cli light keystore', () => {
  const password = '123456';
  const keystore = Keystore.fromJson(keystoreString);

  console.log('keystore =>', keystore);
  const extendedPrivateKey = keystore.extendedPrivateKey(password);
  console.log('extendedPrivateKey =>', extendedPrivateKey);

  it('checks correct password', () => {
    expect(keystore.checkPassword(password)).toBe(true);
  });
});

describe('load ckb cli standard keystore', () => {
  const password = '123456';
  const keystore = Keystore.fromJson(keystoreString);

  it('checks correct password', () => {
    expect(keystore.checkPassword(password)).toBe(true);
  });

  it('loads private key', () => {
    const extendedPrivateKey = keystore.extendedPrivateKey(password);
    expect(extendedPrivateKey.privateKey).toEqual(
      '8af124598932440269a81771ad662642e83a38b323b2f70223b8ae0b6c5e0779',
    );
    expect(extendedPrivateKey.chainCode).toEqual(
      '615302e2c93151a55c29121dd02ad554e47908a6df6d7374f357092cec11675b',
    );
  });
});

describe('load ckb cli origin keystore', () => {
  it('does not load', () => {
    expect(() => Keystore.fromJson(keystoreString)).toThrowError();
  });
});
