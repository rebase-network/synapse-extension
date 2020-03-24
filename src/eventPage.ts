import { MESSAGE_TYPE } from './utils/constants'
import {mnemonicToSeedSync } from './wallet/mnemonic';
import { generateMnemonic, AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
// import * as Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';
import { AddressType, AddressPrefix } from './wallet/address';

const Keystore = require("./wallet/keystore");
/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('data: ', request)

  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    console.log(request.mnemonic)
    console.log(request.password)
    console.log(request.confirmPassword)

    const mnemonic = request.mnemonic;
    const password= request.password;
    const confirmPassword = request.confirmPassword;

    const words = mnemonic.split(" ");

    if(password != confirmPassword) {
      // TODO
      // return err
    }

    if(words.length != 12){ // 12 15 18 24
      // TODO
      // err
    }

    // TODO
    // words 是否在助记词表中

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)

    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
        accountKeychain.publicKey.toString('hex'),
        accountKeychain.chainCode.toString('hex')
    )

    // 判断 AddressPrefix
    const address = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);
    console.log(address.address);

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
  )
    const keystore = Keystore.create(extendedKey, password)

    chrome.storage.sync.set({
      key: keystore
    }, () => {
      console.log('Value is set to ' + keystore);
    });

  }
});
