import { scriptToAddress } from '@keyper/specs/lib/address';

export function findInWalletsByPublicKey(publicKey, wallets) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet;
}

export function findInAddressesListByPublicKey(publicKey, addressesList) {
  function findAddresses(addresses) {
    return addresses.publicKey === publicKey;
  }
  const addresses = addressesList.find(findAddresses);
  return addresses;
}

export function showAddressHelper(networkPrefix: string, script) {
  return scriptToAddress(script, { networkPrefix, short: true });
}
