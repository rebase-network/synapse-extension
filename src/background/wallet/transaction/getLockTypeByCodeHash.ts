import locksInfo, { NETWORKS } from '@common/utils/constants/locksInfo';
import { LockType } from '@common/utils/constants';

const mapping = new Map();
NETWORKS.forEach((networkName) => {
  mapping.set(locksInfo[networkName].secp256k1.codeHash, LockType.Secp256k1);
  mapping.set(locksInfo[networkName].keccak256.codeHash, LockType.Keccak256);
  mapping.set(locksInfo[networkName].anypay.codeHash, LockType.AnyPay);
});

export default (codeHash: string): LockType => mapping.get(codeHash);
