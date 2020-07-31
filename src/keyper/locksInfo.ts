import { ScriptHashType } from '@keyper/specs';
import { NETWORK_TYPES } from '@common/networkManager/constants';

const { testnet, mainnet } = NETWORK_TYPES;
export const NETWORKS = [testnet, mainnet];

export default {
  [testnet]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0x84dcb061adebff4ef93d57c975ba9058a9be939d79ea12ee68003f6492448890',
      depType: 'depGroup',
    },
    keccak256: {
      codeHash: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
      hashType: 'code' as ScriptHashType,
      // TODO
      txHash: '0x0',
      depType: 'depGroup',
    },
    anypay: {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      hashType: 'type' as ScriptHashType,
      txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
      depType: 'depGroup',
    },
  },
  [mainnet]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      depType: 'depGroup',
    },
    keccak256: {
      codeHash: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
      hashType: 'code' as ScriptHashType,
      // TODO
      txHash: '0x0',
      depType: 'code',
    },
    anypay: {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      hashType: 'type' as ScriptHashType,
      txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
      depType: 'depGroup',
    },
  },
};
