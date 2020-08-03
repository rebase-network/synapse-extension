import LOCKS_INFO, { NETWORKS } from '@utils/constants/locksInfo';

type TLockType = 'Secp256k1' | 'Keccak256' | 'AnyPay';
type TNetworkType = 'mainnet' | 'testnet';

export const secp256k1Dep = {
  outPoint: {
    txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
    index: '0x0',
  },
  depType: 'depGroup',
};

export const anypayDep = {
  outPoint: {
    txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
    index: '0x0',
  },
  depType: 'depGroup',
};

export const keccak256Dep = {};

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
