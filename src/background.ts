import { MESSAGE_TYPE } from './utils/constants'
import { mnemonicToSeedSync } from './wallet/mnemonic';
import Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';

import { AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
import { AddressType, AddressPrefix } from './wallet/address';

/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    const confirmPassword = request.confirmPassword.trim();

    if (password != confirmPassword) {
      // TODO
      // return err
    }

    const words = mnemonic.split(" ");
    if (words.length != 12) { // 12 15 18 24
      // TODO
      // err
    }

    // TODO
    // words 是否在助记词表中

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )

    const keystore = Keystore.create(extendedKey, password);

    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
      accountKeychain.publicKey.toString('hex'),
      accountKeychain.chainCode.toString('hex'),
    )

    // 判断 AddressPrefix
    const currAddress = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);
    console.log('currAddress: ' + JSON.stringify(currAddress));

    // TODO
    // 用户多地址如何保存
    const wallet = { keystore: keystore.crypto, address: currAddress.address, path: currAddress.path, pubKey: currAddress.publicKey }

    chrome.storage.sync.set({
      "wallet": wallet
    }, () => {
      console.log('keystore json value: ' + JSON.stringify(keystore));
    });

  }
});