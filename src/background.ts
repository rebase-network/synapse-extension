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
    const addrTestnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Testnet);
    const addrMainnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);
    console.log('addrTestnet: ' + JSON.stringify(addrTestnet));

    const wallet = {
      keystore: keystore.crypto,
      testnet: {
        address: addrTestnet.address,
        path: addrTestnet.path,
        pubKey: addrTestnet.publicKey
      },
      mainnet: {
        address: addrMainnet.address,
        path: addrMainnet.path,
        pubKey: addrMainnet.publicKey
      },
    }

    chrome.storage.sync.set({
      wallet,
    }, () => {
      console.log('wallet is set to storage: ' + JSON.stringify(wallet));
    });
  }

  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['wallet'], function({ wallet }) {
      console.log('Wallet is ' + JSON.stringify(wallet));
      const message = {
        address: {
          testnet: wallet.testnet.address,
          mainnet: wallet.mainnet.address,
        },
        messageType: MESSAGE_TYPE.ADDRESS_INFO
      }
      console.log('message: ', message);

      wallet && chrome.runtime.sendMessage(message)
    });
  }

  // get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['wallet'], async function({ wallet }) {
      console.log('wallet ===> ' + JSON.stringify(wallet));
      const publicKey = '0x' + wallet[request.network].pubKey;
      const capacityAll = await getBalanceByPublicKey(publicKey);
      wallet && chrome.runtime.sendMessage({
        balance: JSON.parse(capacityAll.toString()),
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })
    });
  }
});
