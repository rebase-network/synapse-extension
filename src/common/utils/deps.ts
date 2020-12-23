import LOCKS_INFO, { NETWORKS } from '@src/common/utils/constants/locksInfo';

type TLockType = 'Secp256k1' | 'Keccak256' | 'AnyPay';

export const getDepFromLockType = async (lockType: TLockType, NetworkManager) => {
  const { networkType } = await NetworkManager.getCurrentNetwork();
  if (!networkType || !NETWORKS.includes(networkType)) {
    throw new Error('Network is not supported');
  }
  const lockInfo = LOCKS_INFO[networkType.toLowerCase()][lockType.toLowerCase()];
  if (!lockInfo) {
    throw new Error('No dep match');
  }
  const { txHash, depType, index } = lockInfo;
  const result = {
    outPoint: {
      txHash,
      index,
    },
    depType,
  };
  return result;
};

export default getDepFromLockType;
