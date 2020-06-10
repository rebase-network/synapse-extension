export function saveToStorage(wallets, currentWallet, addressesList) {
  chrome.storage.local.set({ wallets }, () => {});

  chrome.storage.local.set({ currentWallet }, () => {});

  chrome.storage.local.set({ addressesList }, () => {});
}

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
