import { ScriptHashType } from '@keyper/specs';
import { NETWORK_TYPES } from '@src/common/utils/constants/networks';

const { testnet, mainnet, local } = NETWORK_TYPES;
export const NETWORKS = [mainnet, testnet, local];

// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md
const locksInfo = {
  [testnet]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
      depType: 'depGroup',
      index: '0x0',
    },
    keccak256: {
      codeHash: '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
      hashType: 'type' as ScriptHashType,
      txHash: '0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38',
      depType: 'code',
      index: '0x0',
    },
    anypay: {
      codeHash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
      hashType: 'type' as ScriptHashType,
      txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
      depType: 'depGroup',
      index: '0x0',
    },
  },
  [mainnet]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      depType: 'depGroup',
      index: '0x0',
    },
    keccak256: {
      codeHash: '0xbf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc',
      hashType: 'type' as ScriptHashType,
      txHash: '0x1d60cb8f4666e039f418ea94730b1a8c5aa0bf2f7781474406387462924d15d4',
      depType: 'code',
      index: '0x0',
    },
    anypay: {
      codeHash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
      hashType: 'type' as ScriptHashType,
      txHash: '0x4153a2014952d7cac45f285ce9a7c5c0c0e1b21f2d378b82ac1433cb11c25c4d',
      depType: 'depGroup',
      index: '0x0',
    },
  },
};

locksInfo[local] = locksInfo[testnet];

export default locksInfo;
