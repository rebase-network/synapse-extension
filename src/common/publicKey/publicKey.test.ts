import { aliceAddresses } from '@src/tests/fixture/address';
import LOCKS_INFO from '@common/utils/constants/locksInfo';
import PublicKey from '@common/publicKey';

describe('PublicKey', () => {
  it('PublicKey', () => {
    const pubKeyInstance = new PublicKey(aliceAddresses.publicKey);
    const blake160 = pubKeyInstance.getBlake160();
    expect(blake160).toEqual(aliceAddresses.args);
    const publicKeyHash = pubKeyInstance.publicKeyHash();
    expect(publicKeyHash).toEqual(aliceAddresses.args);
    const script = {
      args: blake160,
      codeHash: LOCKS_INFO.testnet.secp256k1.codeHash,
      hashType: LOCKS_INFO.testnet.secp256k1.hashType,
    };
    const lockHash = pubKeyInstance.getLockHash(script);
    expect(lockHash).toEqual(aliceAddresses.secp256k1.lock);
  });
});
