import { MESSAGE_TYPE } from './utils/constants';
import {
  mnemonicToSeedSync,
  validateMnemonic,
  mnemonicToEntropy,
  entropyToMnemonic,
} from './wallet/mnemonic';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { generateMnemonic } from './wallet/key';
import * as Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';
import { ExtendedPrivateKey } from './wallet/key';
import { sendSimpleTransaction } from './sendSimpleTransaction';
import { getStatusByTxHash } from './transaction';
import Address from './wallet/address';
import { getTxHistoryByAddress } from './background/transaction';
import {
  addKeyperWallet,
  getAddressesList,
  getCurrentWallet,
  getWallets,
} from './wallet/addKeyperWallet';

/**
 * Listen messages from popup
 */
let wallets = [];
let currentWallet = {};
let addressesList = [];

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  //IMPORT_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    console.time('total');
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();

    // 验证助记词有效性
    const isValidateMnemonic = validateMnemonic(mnemonic);
    console.log(isValidateMnemonic);
    if (!isValidateMnemonic) {
      console.log('isValidateMnemonic: ', 'Not a ValidateMnemonic');
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    console.log(' ======> mnemonic to keystore ');
    console.time('mnemonic');
    //store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = Keystore.encrypt(Buffer.from(entropy, 'hex'), password);
    console.timeEnd('mnemonic');
    // words 是否在助记词表中
    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    let rootKeystore;
    console.time('<<<--- outside root private key');
    setTimeout(() => {
      console.time('--->>> inside root private key');
      rootKeystore = Keystore.encrypt(Buffer.from(extendedKey.serialize(), 'hex'), password);
      console.timeEnd('--->>> inside root private key');
    }, 0);
    console.timeEnd('<<<--- outside root private key');


    //No '0x' prefix
    const privateKey = masterKeychain
      .derivePath(Address.pathForReceiving(0))
      .privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);

    //check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (addressesObj) {
      const addresses = addressesObj.addresses;
      currentWallet = {
        publicKey: publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
      saveToStorage();
    } else {
      console.time('<<<=== addKeyperWallet outside');
      setTimeout(async () => {
        console.time('===>>> addKeyperWallet inside');
        //Add Keyper to Synapse
        await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore);
        wallets = getWallets();
        addressesList = getAddressesList();
        currentWallet = getCurrentWallet();
        saveToStorage();
        console.timeEnd('===>>> addKeyperWallet inside');
      }, 0);
      console.timeEnd('<<<=== addKeyperWallet outside');
    }

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
    console.timeEnd('total');
  }

  //GEN_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.GEN_MNEMONIC) {
    const newmnemonic = generateMnemonic();

    chrome.runtime.sendMessage({
      mnemonic: newmnemonic,
      messageType: MESSAGE_TYPE.RECE_MNEMONIC,
    });
  }

  //SAVE_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.SAVE_MNEMONIC) {
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    // const confirmPassword = request.confirmPassword.trim();

    //助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);

    if (!isValidateMnemonic) {
      console.log('isValidateMnemonic: ', 'Not a ValidateMnemonic');
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    //store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = Keystore.encrypt(Buffer.from(entropy, 'hex'), password);

    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    const rootKeystore = Keystore.encrypt(Buffer.from(extendedKey.serialize(), 'hex'), password);

    //No '0x' prefix
    const privateKey = masterKeychain
      .derivePath(Address.pathForReceiving(0))
      .privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);

    //check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (addressesObj != null && addressesObj != '') {
      const addresses = addressesObj.addresses;
      currentWallet = {
        publicKey: publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
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

  // get tx history by address
  if (request.messageType === MESSAGE_TYPE.GET_TX_HISTORY) {
    chrome.storage.local.get(['currentWallet'], async function (wallet) {
      const address = wallet.currentWallet ? wallet.currentWallet.address : undefined;

      const txs = address ? await getTxHistoryByAddress(address) : [];

      chrome.runtime.sendMessage({
        txs,
        messageType: MESSAGE_TYPE.SEND_TX_HISTORY,
      });
    });
  }

  if (request.messageType === 'xxxx') {
    const tx = {
      hash: '0x670133ec69d03de5f76f320b38c434cb474620d961c0dcecc5b73f64c3755947',
      block_num: 190532,
      timestamp: 1588864031062,
      inputs: [
        {
          capacity: 830659346699766400,
          address: 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70',
        },
      ],
      outputs: [
        {
          capacity: 500000000000,
          address: 'ckt1qyq9lm2qlxray4utne5pq8m8d387wtspnuus0hfun4',
        },
        {
          capacity: 830658846699765900,
          address: 'ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70',
        },
      ],
      fee: 512,
      income: true,
      amount: 500000000000,
    };

    chrome.runtime.sendMessage({
      tx: tx,
      messageType: 'yyyy',
    });
  }

  //send transactioin
  if (request.messageType === MESSAGE_TYPE.RESQUEST_SEND_TX) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async function (result) {
      const toAddress = request.address.trim();
      const capacity = request.capacity * (10 ** 8);
      const fee = request.fee * (10 ** 8);
      const password = request.password.trim();
      
      const fromAddress = result.currentWallet.address;
      const publicKey = result.currentWallet.publicKey;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
      const privateKey = '0x' + Keystore.decrypt(wallet.keystore, password);

      const sendTxHash = await sendSimpleTransaction(
        privateKey,
        fromAddress,
        toAddress,
        BigInt(capacity),
        BigInt(fee),
      );

      chrome.runtime.sendMessage({
        fromAddress: fromAddress,
        toAddress: toAddress,
        capacity: capacity.toString(),
        fee: fee.toString(),
        txHash: sendTxHash,
        messageType: MESSAGE_TYPE.TO_TX_DETAIL,
      });
    });
  }

  //transactioin detail
  if (request.messageType === MESSAGE_TYPE.REQUEST_TX_DETAIL) {
    // chrome.storage.local.get(['wallet'], async function( {wallet} ) {

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
      messageType: MESSAGE_TYPE.TX_DETAIL,
    });
    // });
  }

  //export-private-key check
  if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK) {
    chrome.storage.local.get(['currentWallet','wallets'], function (result) {
        const password = request.password;
        const publicKey = result.currentWallet.publicKey;
        const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
        const keystore = wallet.keystore;
        //TODO check the password
        const privateKey = '0x' + Keystore.decrypt(keystore, password);

        //send the check result to the page
        if (!privateKey) {
          chrome.runtime.sendMessage({
            isValidatePassword: false,
            messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
          });
        }

        chrome.runtime.sendMessage({
          isValidatePassword: true,
          keystore,
          privateKey,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        });
      });
  }

  //export-private-key-second check
  if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND) {
    const privateKey = request.message.privateKey;
    const keystore = request.message.keystore;

    chrome.runtime.sendMessage({
      privateKey,
      keystore: JSON.stringify(keystore),
      messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT,
    });
  }

  //export-mneonic check
  if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK) {
    chrome.storage.local.get(['currentWallet','wallets'], function (result) {
        const password = request.password;
        const publicKey = result.currentWallet.publicKey;
        const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
        const entropyKeystore = wallet.entropyKeystore;

        //TODO check the password
        const entropy = Keystore.decrypt(entropyKeystore, password);

        // //send the check result to the page
        if (entropy !== '') {
          chrome.runtime.sendMessage({
            isValidatePassword: false,
            messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
          });
        }

        chrome.runtime.sendMessage({
          isValidatePassword: true,
          password,
          entropyKeystore,
          messageType: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
        });
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
      messageType: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT,
    });
  }

  // import private key
  if (request.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {
    chrome.storage.local.get(['currentWallet','wallets'], async function (result) {
        //没有0x的privateKey
        let privateKey: string = request.privateKey.trim();
        if (privateKey.startsWith('0x')) {
          privateKey = privateKey.substr(2);
        }

        const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);
        const password = request.password.trim();

        //check the keystore
        const currentPublicKey = result.currentWallet.publicKey;
        const wallet = findInWalletsByPublicKey(currentPublicKey, result.wallets);
        const keystore = wallet.keystore;
        if (keystore === undefined || keystore === '' || keystore === 'undefined') {
          throw new Error('currentWallet keystore is null');
        }
        if (!Keystore.checkPasswd(keystore, password)) {
          throw new Error('password incorrect');
        }

        //check the keystore exist or not
        const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

        if (addressesObj != null && addressesObj != '') {
          const addresses = addressesObj.addresses;
          currentWallet = {
            publicKey: publicKey,
            address: addresses[0].address,
            type: addresses[0].type,
            lock: addresses[0].lock,
          };
        } else {
          //Add Keyper to Synapse
          await addKeyperWallet(privateKey, password, '', '');
          wallets = getWallets();
          addressesList = getAddressesList();
          currentWallet = getCurrentWallet();
        }

        saveToStorage();

        chrome.runtime.sendMessage({
          messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK,
        });
      });
  }

  // import keystore
  if (request.messageType === MESSAGE_TYPE.IMPORT_KEYSTORE) {
    chrome.storage.local.get(['currentWallet'], async function (result) {
      //01- get the params from request
      const keystore = request.keystore.trim();
      const kPassword = request.keystorePassword.trim();
      const uPassword = request.userPassword.trim();

      //02- check the keystore by the keystorePassword
      if (!Keystore.checkPasswd(keystore, kPassword)) {
        throw new Error('password incorrect');
      }

      //021- check the synapse password
      //check the keystore
      const currentPublicKey = result.currentWallet.publicKey;
      const currWallet = findInWalletsByPublicKey(currentPublicKey, wallets);
      const currentKeystore = currWallet.keystore;
      if (
        currentKeystore === undefined ||
        currentKeystore === '' ||
        currentKeystore === 'undefined'
      ) {
        throw new Error('currentWallet keystore is null');
      }
      if (!Keystore.checkPasswd(currentKeystore, uPassword)) {
        throw new Error('password incorrect');
      }

      //03 - get the private by keystore
      const privateKey = Keystore.decrypt(keystore, kPassword);
      const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);
      //check the keystore exist or not
      const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

      if (addressesObj != null && addressesObj != '') {
        const addresses = addressesObj.addresses;
        currentWallet = {
          publicKey: publicKey,
          address: addresses[0].address,
          type: addresses[0].type,
          lock: addresses[0].lock,
        };
      } else {
        //Add Keyper to Synapse
        await addKeyperWallet(privateKey, uPassword, '', '');
        wallets = getWallets();
        addressesList = getAddressesList();
        currentWallet = getCurrentWallet();
      }

      //002-
      saveToStorage();

      chrome.runtime.sendMessage({
        messageType: MESSAGE_TYPE.IMPORT_KEYSTORE_OK,
      });
    });
  }
});

function saveToStorage() {
  chrome.storage.local.set({ wallets }, () => {
    console.log('wallets is set to storage: ' + JSON.stringify(wallets));
  });

  chrome.storage.local.set({ currentWallet }, () => {
    console.log('currentWallet is set to storage: ' + JSON.stringify(currentWallet));
  });

  chrome.storage.local.set({ addressesList }, () => {
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
  function findAddresses(addresses) {
    return addresses.publicKey === publicKey;
  }
  const addresses = addressesList.find(findAddresses);
  return addresses;
}
