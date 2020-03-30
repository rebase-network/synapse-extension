import { MESSAGE_TYPE } from './utils/constants'
import { mnemonicToSeedSync } from './wallet/mnemonic';
import Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';

import { AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
import { AddressType, AddressPrefix } from './wallet/address';
import {getBalanceByPublicKey} from './balance';

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

    // 判断 AddressPrefix Mainnet=>Testnet
    const currAddress = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Testnet);
    console.log('currAddress: ' + JSON.stringify(currAddress));

    // TODO
    // 用户多地址如何保存
    const wallet = { keystore: keystore.crypto, address: currAddress.address, path: currAddress.path, pubKey: currAddress.publicKey }

    chrome.storage.sync.set({
      wallet,
      key: keystore.crypto
    }, () => {
      console.log('keystore json value: ' + JSON.stringify(keystore));
      // chrome.runtime.sendMessage({
      //   address: wallet.address,
      //   messageType: MESSAGE_TYPE.ADDRESS_INFO
      // })
    });
  }

  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['wallet'], function({ wallet }) {
      console.log('Value currently is ' + wallet);
      wallet && chrome.runtime.sendMessage({
        address: wallet.address,
        messageType: MESSAGE_TYPE.ADDRESS_INFO
      })
    });
  }

  //get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['wallet'], async function({ wallet }) {
      console.log('wallet ===> ' + JSON.stringify(wallet));
      const publicKey = '0x' + wallet.pubKey;//
      const capacityAll = await getBalanceByPublicKey(publicKey);
      wallet && chrome.runtime.sendMessage({
        balance: JSON.parse(capacityAll.toString()),
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })
    });
  }
});
