import { MESSAGE_TYPE, KEYSTORE_TYPE, Ckb } from './utils/constants'
import { mnemonicToSeedSync, validateMnemonic, mnemonicToEntropy, entropyToMnemonic } from './wallet/mnemonic';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'

import { generateMnemonic } from './wallet/key';
import * as Keystore from './wallet/pkeystore';
import Keychain from './wallet/keychain';

import { AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
import { AddressType, AddressPrefix } from './wallet/address';
import { getBalanceByPublicKey, getBalanceByLockHash } from './balance';
import { sendSimpleTransaction } from './sendSimpleTransaction';
import { getAmountByTxHash, getStatusByTxHash, getFeeByTxHash, getInputAddressByTxHash, getOutputAddressByTxHash, getOutputAddressByTxHashAndIndex } from './transaction';
import { getPrivateKeyByKeyStoreAndPassword } from './wallet/exportPrivateKey'
import Address from './wallet/address';
import { getBalanceByAddress } from './utils/address'
import { addKeyperWallet, getAddressesList, getCurrentWallet, getWallets } from './wallet/addKeyperWallet';

/**
 * Listen messages from popup
 */

//TODO ====
let wallets = [];
let currentWallet = {};
let addressesList = [];

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  //IMPORT_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();

    //助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);
    console.log(isValidateMnemonic)
    if (!isValidateMnemonic) {
      console.log('isValidateMnemonic: ', "Not a ValidateMnemonic");
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    //store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = Keystore.encrypt(Buffer.from(entropy, "hex"), password);

    // words 是否在助记词表中
    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )
    const rootKeystore = Keystore.encrypt(Buffer.from(extendedKey.serialize(), "hex"), password);

    //No '0x' prefix
    const privateKey = masterKeychain.derivePath(Address.pathForReceiving(0)).privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);

    //check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (addressesObj != null && addressesObj != "") {
      const addresses = addressesObj.addresses;
      currentWallet = {
        publicKey: publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      }
    } else {

      //Add Keyper to Synapse
      await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore);
      wallets = getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }
    //002-
    saveToStorage();

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS)
  }

  //GEN_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.GEN_MNEMONIC) {
    const newmnemonic = generateMnemonic()

    chrome.runtime.sendMessage({
      mnemonic: newmnemonic,
      messageType: MESSAGE_TYPE.RECE_MNEMONIC
    })
  }

  //SAVE_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.SAVE_MNEMONIC) {
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    // const confirmPassword = request.confirmPassword.trim();

    //助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);

    if (!isValidateMnemonic) {
      console.log('isValidateMnemonic: ', "Not a ValidateMnemonic");
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    //store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = Keystore.encrypt(Buffer.from(entropy, "hex"), password);

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )
    const rootKeystore = Keystore.encrypt(Buffer.from(extendedKey.serialize(), "hex"), password);

    //No '0x' prefix
    const privateKey = masterKeychain.derivePath(Address.pathForReceiving(0)).privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);

    //check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (addressesObj != null && addressesObj != "") {
      const addresses = addressesObj.addresses;
      currentWallet = {
        publicKey: publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      }
    } else {

      //Add Keyper to Synapse
      await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore);
      wallets = getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }

    //002-saveToStorage
    saveToStorage();

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
  }

  //REQUEST_ADDRESS_INFO
  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['currentWallet'], function (wallet) {

      if (!wallet) return
      const address = wallet.currentWallet.address;
      const message: any = {
        messageType: MESSAGE_TYPE.ADDRESS_INFO,
        address: address
      }

      chrome.runtime.sendMessage(message)

    });
  }

  // get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['currentWallet'], async function (wallet) {

      if (!wallet) return
      const address = wallet.currentWallet.address;
      const balance = await getBalanceByAddress(address)

      chrome.runtime.sendMessage({
        balance,
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })

    });
  }

  //send transactioin
  if (request.messageType === MESSAGE_TYPE.RESQUEST_SEND_TX) {

    chrome.storage.sync.get(['currentWallet'], async function (result) {

      const toAddress = request.address.trim();
      const amount = request.amount.trim();
      const fee = request.fee.trim();
      const password = request.password.trim();

      const fromAddress = result.currentWallet.address;
      const publicKey = result.currentWallet.publicKey;
      const wallet = findInWalletsByPublicKey(publicKey, wallets);
      const privateKey = '0x' + Keystore.decrypt(wallet.keystore, password);

      const sendTxHash = await sendSimpleTransaction(privateKey, fromAddress, toAddress, BigInt(amount), BigInt(fee));

      chrome.runtime.sendMessage({
        fromAddress: fromAddress,
        toAddress: toAddress,
        amount: amount.toString(),
        fee: fee.toString(),
        txHash: sendTxHash,
        messageType: MESSAGE_TYPE.TO_TX_DETAIL
      })

    });
  }

  //transactioin detail
  if (request.messageType === MESSAGE_TYPE.REQUEST_TX_DETAIL) {
    // chrome.storage.sync.get(['wallet'], async function( {wallet} ) {

    const txHash = request.message.txHash;
    const amount = request.message.amount;
    const fee = request.message.fee;
    const inputs = request.message.fromAddress;
    const outputs = request.message.toAddress;
    const status = await getStatusByTxHash(txHash);

    chrome.runtime.sendMessage({
      status,
      tradeAmount: amount,
      fee,
      inputs,
      outputs,
      txHash,
      messageType: MESSAGE_TYPE.TX_DETAIL
    })
    // });
  }

  //export-private-key check
  if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK) {

    chrome.storage.sync.get(['currentWallet'], function (wallet) {

      const password = request.password;
      const keystore = wallet.currentWallet.keystore
      //TODO check the password
      const privateKey = Keystore.decrypt(keystore, password)

      //send the check result to the page
      if (!privateKey) {
        chrome.runtime.sendMessage({
          isValidatePassword: false,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT
        })
      }

      chrome.runtime.sendMessage({
        isValidatePassword: true,
        keystore,
        privateKey,
        messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT
      })
    });
  }

  //export-private-key-second check
  if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND) {

    const privateKey = request.message.privateKey;
    const keystore = request.message.keystore;

    chrome.runtime.sendMessage({
      privateKey,
      keystore: JSON.stringify(keystore),
      messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT
    })
  }

  //my addressesList
  if (request.messageType === MESSAGE_TYPE.REQUEST_MY_ADDRESSES) {
    chrome.storage.sync.get(['accounts'], async function (result) {
      const accounts = result.accounts;
      const addressesList = [];
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const capacity = await getBalanceByLockHash(account.lock);
        const address = {
          address: account.address,
          type: account.type,
          capacity: capacity.toString(),
          lock: account.lock
        }
        addressesList.push(address);
      }
      console.log("addressesList =>", addressesList);
      chrome.runtime.sendMessage({
        addressesList: addressesList,
        messageType: MESSAGE_TYPE.REQUEST_MY_ADDRESSES
      })
    });
  }

  //export-mneonic check
  if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK) {

    chrome.storage.sync.get(['currentWallet'], function (wallet) {

      const password = request.password;
      const entropyKeystore = wallet.currentWallet.entropyKeystore
      //TODO check the password
      const entropy = Keystore.decrypt(entropyKeystore, password)

      console.log("entropy ===>", entropy);
      // //send the check result to the page
      if (entropy !== "") {
        chrome.runtime.sendMessage({
          isValidatePassword: false,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT
        })
      }

      chrome.runtime.sendMessage({
        isValidatePassword: true,
        password,
        entropyKeystore,
        messageType: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT
      })
    });
  }

  //export-mneonic-second check
  if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND) {

    const password = request.message.password;
    const entropyKeystore = request.message.entropyKeystore;

    const entropy = Keystore.decrypt(entropyKeystore, password);
    const mnemonic = entropyToMnemonic(entropy);

    chrome.runtime.sendMessage({
      // mnemonic: JSON.stringify(mnemonic),
      mnemonic,
      messageType: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT
    })
  }

  // import private key
  if (request.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {

    //没有0x的privateKey
    let privateKey: string = request.privateKey.trim();
    if (privateKey.startsWith("0x")) {
      privateKey = privateKey.substr(2);
    }
    const password = request.password.trim()

    //TODO 是否需要currentWallet中的keystore的验证;
    const keystore = currentWallet['keystore']
    if (keystore === undefined || keystore === "" || keystore === "undefined") {
      throw new Error('currentWallet keystore is null')
    }
    if (!Keystore.checkPasswd(keystore, password)) {
      throw new Error('password incorrect')
    }

    const addressObj = Address.fromPrivateKey(privateKey);
    const address = addressObj.address;
    const isExistObj = addressIsExist(address, addressesList);
    if (isExistObj["isExist"]) {
      const index = isExistObj["index"];
      currentWallet = wallets[addressesList[index].walletIndex];
    } else {
      //001-
      // saveWallets(privateKey, password, "", "");

      //Add Keyper to Synapse
      await addKeyperWallet(privateKey, password, "", "");
    }

    //002-
    saveToStorage();

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK
    })
  }

  // import keystore
  if (request.messageType === MESSAGE_TYPE.IMPORT_KEYSTORE) {

    //01- get the params from request
    const keystore = request.keystore.trim();
    const kPassword = request.keystorePassword.trim();
    const uPassword = request.userPassword.trim()

    //02- check the keystore by the keystorePassword
    if (!Keystore.checkPasswd(keystore, kPassword)) {
      throw new Error('password incorrect')
    }

    //021- check the synapse password
    const currentKeystore = currentWallet['keystore']
    if (currentKeystore === undefined || currentKeystore === "" || currentKeystore === "undefined") {
      throw new Error('currentWallet keystore is null')
    }
    if (!Keystore.checkPasswd(currentKeystore, uPassword)) {
      throw new Error('password incorrect')
    }

    //03 - get the private by keystore
    const privateKey = Keystore.decrypt(keystore, kPassword);

    //04- create the new keystore by the synapsePassword;
    const addressObj = Address.fromPrivateKey(privateKey);
    const address = addressObj.address;
    const isExistObj = addressIsExist(address, addressesList);
    if (isExistObj["isExist"]) {
      const index = isExistObj["index"];
      currentWallet = wallets[addressesList[index].walletIndex];
    } else {
      //001-
      // saveWallets(privateKey, uPassword, "", "");

      //Add Keyper to Synapse
      await addKeyperWallet(privateKey, uPassword, "", "");
    }

    //002-
    saveToStorage();

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.IMPORT_KEYSTORE_OK
    })
  }
});

function saveToStorage() {
  chrome.storage.sync.set({ wallets, }, () => {
    console.log('wallets is set to storage: ' + JSON.stringify(wallets));
  });

  chrome.storage.sync.set({ currentWallet, }, () => {
    console.log('currentWallet is set to storage: ' + JSON.stringify(currentWallet));
  });

  chrome.storage.sync.set({ addressesList, }, () => {
    console.log('addressesList is set to storage: ' + JSON.stringify(addressesList));
  });
}


function findInWalletsByPublicKey(publicKey, wallets) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet;
}

function findInAddressesListByPublicKey(publicKey, addressesList) {

  console.log("--- publicKey ---", publicKey);
  console.log("--- addressesList ---", JSON.stringify(addressesList));

  function findAddresses(addresses) {
    console.log("--- addresses ---", addresses);
    return addresses.publicKey === publicKey;
  }
  const addresses = addressesList.find(findAddresses);
  return addresses;
}

function addressIsExist(address, addressesList): {} {
  let isExist = false;
  let index = 99999;
  if (addressesList.length === 0) {
    //不处理
  } else {
    for (let i = 0; i < addressesList.length; i++) {
      if (address === addressesList[i].address) {
        isExist = true;
        // currentWallet = wallets[addressesList[i].walletIndex];
        index = i;
        break;
      }
    }
  }
  const result = {
    isExist: isExist,
    index: index
  }
  return result;
}