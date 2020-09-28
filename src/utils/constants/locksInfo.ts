import { ScriptHashType } from '@keyper/specs';
import { NETWORK_TYPES } from '@utils/constants/networks';

const { testnet, mainnet, local } = NETWORK_TYPES;
export const NETWORKS = [mainnet, testnet, local];

// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-system-script-list/0024-ckb-system-script-list.md
export default {
  [local]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
      depType: 'depGroup',
      index: '0x0',
    },
    keccak256: {
      codeHash: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
      hashType: 'code' as ScriptHashType,
      // TODO: not deployed yet, how to handle local net?
      txHash: '0x',
      depType: 'depGroup',
      index: '0x0',
    },
    anypay: {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      hashType: 'type' as ScriptHashType,
      // TODO: not deployed yet, how to handle local net?
      txHash: '0x',
      depType: 'depGroup',
      index: '0x0',
    },
  },
  [testnet]: {
    secp256k1: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type' as ScriptHashType,
      txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
      depType: 'depGroup',
      index: '0x0',
    },
    keccak256: {
      codeHash: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
      hashType: 'code' as ScriptHashType,
      // TODO: not deployed yet
      txHash: '0x',
      depType: 'depGroup',
      index: '0x0',
    },
    anypay: {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
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
      codeHash: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
      hashType: 'code' as ScriptHashType,
      // TODO: not deployed yet
      txHash: '0x0',
      depType: 'code',
      index: '0x0',
    },
    anypay: {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      hashType: 'type' as ScriptHashType,
      // TODO: not deployed yet
      txHash: '0x0',
      depType: 'depGroup',
      index: '0x0',
    },
  },
};
