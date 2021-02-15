import { scriptToAddress } from '@keyper/specs/lib/address';
import { bech32Address, AddressType, AddressPrefix } from '@nervosnetwork/ckb-sdk-utils';
import lockUtils from '@utils/lock';
import { AnyPayCodeHashIndex } from '@utils/constants/locksInfo';

export function findInWalletsByPublicKey(publicKey, wallets) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet;
}

export function showAddressHelper(networkPrefix: string, script: CKBComponents.Script) {
  // anypay short address
  if (lockUtils.isAnypay(script.codeHash)) {
    return bech32Address(script.args, {
      codeHashOrCodeHashIndex: AnyPayCodeHashIndex,
      prefix: networkPrefix as AddressPrefix,
      type: AddressType.HashIdx,
    });
  }
  // other address
  return scriptToAddress(script, { networkPrefix, short: true });
}
