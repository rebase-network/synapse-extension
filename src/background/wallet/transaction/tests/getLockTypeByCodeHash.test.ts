import { LockType } from '@common/utils/constants';
import locksInfo, { NETWORKS } from '@common/utils/constants/locksInfo';
import getLockTypeByCodeHash from '../getLockTypeByCodeHash';

describe('getLockTypeByCodeHash', () => {
  it('should get correct lock type', () => {
    NETWORKS.forEach((networkName) => {
      const Secp256k1LockType = getLockTypeByCodeHash(locksInfo[networkName].secp256k1.codeHash);
      expect(Secp256k1LockType).toEqual(LockType.Secp256k1);
      const Keccak256LockType = getLockTypeByCodeHash(locksInfo[networkName].keccak256.codeHash);
      expect(Keccak256LockType).toEqual(LockType.Keccak256);
      const AnyPayLockType = getLockTypeByCodeHash(locksInfo[networkName].anypay.codeHash);
      expect(AnyPayLockType).toEqual(LockType.AnyPay);
    });
  });
});
