import { ScriptHashType } from '@keyper/specs';
import { NETWORK_TYPES } from '@utils/constants/networks';

type TypeScript = 'simpleudt';

const { testnet, mainnet } = NETWORK_TYPES;
export const NETWORKS = [testnet, mainnet];

// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md
export const TypesInfo = {
  [testnet]: {
    simpleudt: {
      codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
      hashType: 'data' as ScriptHashType,
      txHash: '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958',
      depType: 'code',
      index: '0x0',
    },
  },
  [mainnet]: {
    simpleudt: {
      codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
      hashType: 'data' as ScriptHashType,
      // TODO: not deployed yet
      txHash: '0x0',
      depType: 'depGroup',
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
