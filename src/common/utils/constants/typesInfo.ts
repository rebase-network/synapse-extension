import { ScriptHashType } from '@keyper/specs';
import { NETWORK_TYPES } from '@src/common/utils/constants/networks';

type TypeScript = 'simpleudt';

const { testnet, mainnet } = NETWORK_TYPES;
export const NETWORKS = [testnet, mainnet];

// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md
export const TypesInfo = {
  [testnet]: {
    simpleudt: {
      codeHash: '0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4',
      hashType: 'type' as ScriptHashType,
      txHash: '0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769',
      depType: 'code',
      index: '0x0',
    },
  },
  [mainnet]: {
    simpleudt: {
      codeHash: '0x5e7a36a77e68eecc013dfa2fe6a23f3b6c344b04005808694ae6dd45eea4cfd5',
      hashType: 'type' as ScriptHashType,
      txHash: '0xc7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d5',
      depType: 'code',
      index: '0x0',
    },
  },
};

export const getDepFromType = async (type: TypeScript = 'simpleudt', NetworkManager) => {
  const { networkType } = await NetworkManager.getCurrentNetwork();
  if (!networkType || !NETWORKS.includes(networkType)) {
    throw new Error('Network is not supported');
  }
  const typeInfo = TypesInfo[networkType.toLowerCase()][type.toLowerCase()];
  if (!typeInfo) {
    throw new Error('No dep match');
  }
  const { txHash, depType, index } = typeInfo;
  const result = {
    outPoint: {
      txHash,
      index,
    },
    depType,
  };
  return result;
};
