import { bobAddresses } from '@src/tests/fixture/address';
import Address from '../address';

describe('address', () => {
  const { publicKey, privateKey } = bobAddresses;
  const addressInstance = Address.fromPublicKey(publicKey);
  it('should be able to get address from public key', () => {
    expect(addressInstance.address).toEqual(bobAddresses.secp256k1.address);
  });

  it('should be able to get address from private key', () => {
    expect(Address.fromPrivateKey(privateKey.substring(2)).address).toEqual(
      bobAddresses.secp256k1.address,
    );
  });

  it('should be able to get address from private key with 0x prefix', () => {
    expect(Address.fromPrivateKey(privateKey).address).toEqual(bobAddresses.secp256k1.address);
  });

  it('return correct path', () => {
    const path = Address.pathFor(0, 1);
    expect(path).toEqual("m/44'/309'/0'/0/1");
    const pathForReceiving = Address.pathForReceiving(1);
    expect(pathForReceiving).toEqual("m/44'/309'/0'/0/1");
    const pathForChange = Address.pathForChange(1);
    expect(pathForChange).toEqual("m/44'/309'/0'/1/1");
  });

  it('should get correct value from toBlake160', () => {
    const result = Address.toBlake160(publicKey);
    expect(result.toString()).toEqual(
      '155,132,136,122,178,234,23,9,152,207,249,137,86,117,220,210,156,210,109,77',
    );
  });
  it('should get correct value from toLockHash', () => {
    const result = Address.toLockHash(publicKey);
    expect(result).toEqual('0x1699256ac9b6445a6ac0e6f2e82ad78840b2c16969a31530904355026d0ea8bd');
  });
  it('should get correct value from getBlake160', () => {
    const result = addressInstance.getBlake160();
    expect(result).toEqual('0x0cfa67e35069ac4923ee86a0a83de9a72e5da33c');
  });
  it('should get correct value from publicKeyHash', () => {
    const result = addressInstance.publicKeyHash();
    expect(result).toEqual('0x0cfa67e35069ac4923ee86a0a83de9a72e5da33c');
  });
  it('should get correct value from getLockHash', () => {
    const result = addressInstance.getLockHash();
    expect(result).toEqual('0x86fc028b48d783374d91f6f3d449d65f6a347bd5b7d0bfdee0c64ff8287dc7f0');
  });
});
