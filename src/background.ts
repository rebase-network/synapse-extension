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

// import * as KeyperWallet from '../src/keyper/wallet.js';
const KeyperWallet = require('../src/keyper/keyperwallet');
// const EC = require("elliptic").ec;

/**
 * Listen messages from popup
 */

//TODO ====
let wallets = []
let currWallet = {}
let addresses = []

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

    const privateKey = masterKeychain.derivePath(Address.pathForReceiving(0)).privateKey.toString('hex');
    console.log("PrivateKey ===>", privateKey);
    const addressObject = Address.fromPrivateKey(privateKey);
    const address = addressObject.address;
    console.log("address ===>", address);

    // //Add Keyper to Synapse
    // console.log("Keyper Init ==== !!!!");
    // await KeyperWallet.init(); //初始化Container
    // await KeyperWallet.generateKeyPrivateKey(password, privateKey);
    // //Keyper accounts
    // const accounts = await KeyperWallet.accounts()
    // chrome.storage.sync.set({ accounts, }, () => {
    //   console.log('keyper accounts is set to storage: ' + JSON.stringify(accounts));
    // });
    // console.log("Keyper End ==== !!!!");

    //验证导入的Keystore是否已经存在
    const isExistObj = addressIsExist(address, addresses);
    if (isExistObj["isExist"]) {
      const index = isExistObj["index"];
      currWallet = wallets[addresses[index].walletIndex];
    } else {
      //001-
      privateKeyToKeystore(privateKey, password, entropyKeystore, rootKeystore);
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
    const confirmPassword = request.confirmPassword.trim();

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

    const privateKey = "0x" + masterKeychain.derivePath(Address.pathForReceiving(0)).privateKey.toString('hex');
    console.log("PrivateKey ===>", privateKey);
    const addressObject = Address.fromPrivateKey(privateKey);
    const address = addressObject.address;
    console.log("address ===>", address);

    // //Add Keyper to Synapse
    // console.log("Keyper Init ==== !!!!");
    // await KeyperWallet.init(); //初始化Container
    // await KeyperWallet.generateKeyPrivateKey(password, privateKey);
    // //Keyper accounts
    // const accounts = await KeyperWallet.accounts()
    // chrome.storage.sync.set({ accounts, }, () => {
    //   console.log('keyper accounts is set to storage: ' + JSON.stringify(accounts));
    // });
    // console.log("Keyper End ==== !!!!");

    //验证导入的Keystore是否已经存在
    //000-addressIsExist
    const isExistObj = addressIsExist(address, addresses);
    if (isExistObj["isExist"]) {
      const index = isExistObj["index"];
      currWallet = wallets[addresses[index].walletIndex];
    } else {
      //001-privateKeyToKeystore
      privateKeyToKeystore(privateKey, password, entropyKeystore, rootKeystore);
    }
    //002-saveToStorage
    saveToStorage();

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
  }

  //REQUEST_ADDRESS_INFO
  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['currWallet'], function (wallet) {
      const message: any = {
        messageType: MESSAGE_TYPE.ADDRESS_INFO
      }
      if (wallet) {
        message.address = wallet.currWallet.address
      }
      console.log(message);

      chrome.runtime.sendMessage(message)
    });
  }

  // get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['currWallet'], async function (wallet) {
      const capacity = await getBalanceByLockHash(wallet["currWallet"]["lockHash"]);
      const balance = capacity.toString()

      chrome.runtime.sendMessage({
        balance,
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })
    });
  }

  //发送交易
  if (request.messageType === MESSAGE_TYPE.RESQUEST_SEND_TX) {

    chrome.storage.sync.get(['currWallet'], async function (wallet) {

      //1- 从chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.SEND_TX })获取values的值
      const toAddress = request.address.trim();
      const amount = request.amount.trim();
      const fee = request.fee.trim();
      const password = request.password.trim();
      const network = request.network.trim();

      const privateKey = '0x' + Keystore.decrypt(wallet.currWallet.keystore, password);
      //PrivateKey导入的情况还未解决
      let fromAddress = "";
      if (network === "testnet") {
        fromAddress = wallet.currWallet.testnetAddr;
      } else if (network === "mainnet") {
        fromAddress = wallet.currWallet.mainnetAddr;
      }

      const sendTxHash = await sendSimpleTransaction(
        privateKey,
        fromAddress,
        toAddress,
        BigInt(amount),
        BigInt(fee));

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

  //tx-detail
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

    chrome.storage.sync.get(['currWallet'], function (wallet) {

      const password = request.password;
      const keystore = wallet.currWallet.keystore
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

  //my addresses
  if (request.messageType === MESSAGE_TYPE.REQUEST_MY_ADDRESSES) {

    chrome.storage.sync.get(['accounts'], async function (result) {
      console.log("MESSAGE_TYPE.REQUEST_MY_ADDRESSES");

      // const addresses = [];
      // const length = result.wallets.length;
      // const wallets = result.wallets;

      // for (let index = 0; index < length; index++) {
      //   const mainnetAddr = wallets[index].mainnetAddr;
      //   const testnetAddr = wallets[index].testnetAddr;
      //   const lockHash = wallets[index].lockHash;
      //   const capacity = await getBalanceByLockHash(lockHash);
      //   const address = {
      //     "mainnetAddr": mainnetAddr,
      //     "testnetAddr": testnetAddr,
      //     "capacity": capacity.toString()
      //   }
      //   addresses.push(address);
      // }

      // chrome.runtime.sendMessage({
      //   addresses,
      //   messageType: MESSAGE_TYPE.RESULT_MY_ADDRESSES
      // })
      await new Promise(resolve => setTimeout(resolve, 500));

      // await KeyperWallet.init();
      // const accounts = await KeyperWallet.accounts();
      console.log("result =>", result);
      const accounts = result.accounts;
      const addresses = [];
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const capacity = await getBalanceByLockHash(account.lock);
        const address = {
          address: account.address,
          type: account.type,
          capacity: capacity.toString(),
          lock: account.lock
        }
        addresses.push(address);
      }
      console.log("addresses =>", addresses);
      chrome.runtime.sendMessage({
        addresses: addresses,
        messageType: MESSAGE_TYPE.RESULT_MY_ADDRESSES
      })
    });
  }

  //export-mneonic check
  if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK) {

    chrome.storage.sync.get(['currWallet'], function (wallet) {

      const password = request.password;
      console.log("wallet.currWallet ===>", wallet.currWallet)
      const entropyKeystore = wallet.currWallet.entropyKeystore
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

  //onKeyper test
  // if (request.messageType === MESSAGE_TYPE.ON_KEYPER) {

  //   await KeyperWallet.init(); //初始化Container
  //   // console.log("Init ==== !!!!");
  //   const password = "123456";
  //   const privateKey = "";
  //   const publicKey = await KeyperWallet.generateKeyKeyper(password, privateKey, publicKey);
  //   console.log(publicKey);

  //   const accounts = await KeyperWallet.accounts();

  //   //Just For Test
  //   // console.log("accounts ===>: ", accounts);
  //   // for (let i = 0; i < accounts.length; i++) {
  //   //   const account = accounts[i];
  //   //   console.log("account.lock ===>",account.lock);
  //   //   // const result = await cache.findCells(
  //   //   //   JSON.stringify(
  //   //   //     QueryBuilder.create()
  //   //   //       .setLockHash(account.lock)
  //   //   //       .build()
  //   //   //   )
  //   //   // );
  //   // }
  //   const addresses = [];
  //   for (let i = 0; i < accounts.length; i++) {
  //     const account = accounts[i];
  //     // const capacity = await getBalanceByLockHash(account.lock);
  //     const capacity = 0;
  //     const address = {
  //       address: account.address,
  //       type: account.type,
  //       capacity: capacity,
  //       lock: account.lock
  //     }
  //     addresses.push(address);
  //   }

  //   chrome.runtime.sendMessage({
  //     addresses,
  //     messageType: MESSAGE_TYPE.RESULT_MY_ADDRESSES
  //   })
  // }


  // import private key
  if (request.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {

    const privateKey = "0x" + request.privatekey.trim()
    const password = request.password.trim()

    const keystore = currWallet['keystore']

    if (keystore === undefined || keystore === "" || keystore === "undefined") {
      throw new Error('currWallet keystore is null')
    }

    if (!Keystore.checkPasswd(keystore, password)) {
      throw new Error('password incorrect')
    }

    const address = Address.fromPrivateKey(privateKey);
    const isExistObj = addressIsExist(address, addresses);
    if (isExistObj["isExist"]) {
      const index = isExistObj["index"];
      currWallet = wallets[addresses[index].walletIndex];
    } else {
      //001-
      privateKeyToKeystore(privateKey, password, "", "");
    }

    //002-
    saveToStorage();

    chrome.runtime.sendMessage(MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK);

  }

});

//3- Type
function privateKeyToKeystore(privateKey, password, entropyKeystore, rootKeystore, prefix = AddressPrefix.Testnet) {

  const buff = Buffer.from(privateKey, 'hex')
  const newkeystore = Keystore.encrypt(buff, password)

  let _obj = {}
  _obj['id'] = newkeystore.id
  _obj['version'] = newkeystore.version
  _obj["crypto"] = newkeystore.crypto

  const addressObj = Address.fromPrivateKey(privateKey, prefix);
  const blake160 = addressObj.getBlake160(); //publicKeyHash

  const lockHash = ckbUtils.scriptToHash({
    hashType: "type",
    codeHash: Ckb.MainNetCodeHash,
    args: blake160,
  })

  const wallet = {
    "path": addressObj.path, //ckt 有问题
    "blake160": blake160,
    "address": addressObj.address,
    "lockHash": lockHash,
    "entropyKeystore": entropyKeystore, //助记词
    "rootKeystore": rootKeystore, //Root
    "keystore": _obj,
    "keystoreType": KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE
  }
  wallets.push(wallet)

  const _address = {
    "address": addressObj.address,
    "walletIndex": wallets.length - 1
  }
  addresses.push(_address);
  currWallet = wallets[_address.walletIndex];
}

function saveToStorage() {

  chrome.storage.sync.set({ wallets, }, () => {
    console.log('wallets is set to storage: ' + JSON.stringify(wallets));
  });

  chrome.storage.sync.set({ currWallet, }, () => {
    console.log('currWallet is set to storage: ' + JSON.stringify(currWallet));
  });

  chrome.storage.sync.set({ addresses, }, () => {
    console.log('addresses is set to storage: ' + JSON.stringify(addresses));
  });
}

function addressIsExist(address, addresses): {} {
  let isExist = false;
  let index = 99999;
  if (addresses.length === 0) {
    //不处理
  } else {
    for (let i = 0; i < addresses.length; i++) {
      if (address === addresses[i].address) {
        isExist = true;
        // currWallet = wallets[addresses[i].walletIndex];
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