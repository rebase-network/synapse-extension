import * as browser from 'webextension-polyfill';
import {
  mnemonicToSeedSync,
  validateMnemonic,
  mnemonicToEntropy,
  entropyToMnemonic,
} from '@src/wallet/mnemonic';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { generateMnemonic, ExtendedPrivateKey } from '@src/wallet/key';
import Keychain from '@src/wallet/keychain';
import { sendTransaction } from '@src/wallet/transaction/sendTransaction';
import Address from '@src/wallet/address';
import { createScriptObj, signTxFromMsg } from '@background/transaction';
import { getTxHistories } from '@utils/apis';
import {
  addKeyperWallet,
  getAddressesList,
  getCurrentWallet,
  getWallets,
  signTx,
} from '@src/wallet/addKeyperWallet';
import * as WalletKeystore from '@src/wallet/keystore';
import * as PasswordKeystore from '@src/wallet/passwordEncryptor';
import * as _ from 'lodash';
import {
  saveToStorage,
  findInWalletsByPublicKey,
  findInAddressesListByPublicKey,
} from '@utils/wallet';
import { getStatusByTxHash, getBlockNumberByTxHash, sendSignedTx } from '@utils/transaction';
import { MESSAGE_TYPE } from '@utils/constants';
import addExternalMessageListener from '@background/messageHandlers';
import { WEB_PAGE } from '@src/utils/message/constants';
import { sendToWebPage } from '@background/messageHandlers/proxy';

import { indexerAddresses, getTipBlockNumber } from '@background/indexer';

/**
 * Listen messages from popup
 */

let wallets = [];
let currentWallet = {};
let addressesList = [];

/**
 * Listen messages from popup
 */
addExternalMessageListener();

chrome.runtime.onMessage.addListener(async (request) => {
  // IMPORT_MNEMONIC
  if (request.type === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();

    // 验证助记词有效性
    const isValidateMnemonic = validateMnemonic(mnemonic);
    if (!isValidateMnemonic) {
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    // store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = await PasswordKeystore.encrypt(Buffer.from(entropy, 'hex'), password);

    // words 是否在助记词表中
    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    const rootKeystore = await PasswordKeystore.encrypt(
      Buffer.from(extendedKey.serialize(), 'hex'),
      password,
    );

    // No '0x' prefix
    const privateKey = masterKeychain
      .derivePath(Address.pathForReceiving(0))
      .privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);

    // check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (!_.isEmpty(addressesObj)) {
      const { addresses } = addressesObj;
      currentWallet = {
        publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      // Add Keyper to Synapse
      const accounts = await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore);

      // add addresses indexer
      await indexerAddresses(accounts);

      wallets = getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }

    saveToStorage(wallets, currentWallet, addressesList);

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
  }

  // GEN_MNEMONIC
  if (request.type === MESSAGE_TYPE.GEN_MNEMONIC) {
    const newmnemonic = generateMnemonic();

    chrome.runtime.sendMessage({
      mnemonic: newmnemonic,
      type: MESSAGE_TYPE.RECE_MNEMONIC,
    });
  }

  // SAVE_MNEMONIC
  if (request.type === MESSAGE_TYPE.SAVE_MNEMONIC) {
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    // const confirmPassword = request.confirmPassword.trim();

    // 助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);

    if (!isValidateMnemonic) {
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    // store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = await PasswordKeystore.encrypt(Buffer.from(entropy, 'hex'), password);

    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    const rootKeystore = await PasswordKeystore.encrypt(
      Buffer.from(extendedKey.serialize(), 'hex'),
      password,
    );

    // No '0x' prefix
    const privateKey = masterKeychain
      .derivePath(Address.pathForReceiving(0))
      .privateKey.toString('hex');
    const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);

    // check the keystore exist or not
    const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

    if (!_.isEmpty(addressesObj)) {
      const { addresses } = addressesObj;
      currentWallet = {
        publicKey,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      // Add Keyper to Synapse
      const accounts = await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore);

      const currBlkNumber = await getTipBlockNumber();
      // add addresses indexer
      await indexerAddresses(accounts, currBlkNumber);
      wallets = getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }

    // 002-saveToStorage
    saveToStorage(wallets, currentWallet, addressesList);

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
  }

  // get tx history by address
  if (request.type === MESSAGE_TYPE.GET_TX_HISTORY) {
    // /
    chrome.storage.local.get(['currentWallet'], async (wallet) => {
      const address = wallet.currentWallet ? wallet.currentWallet.address : undefined;
      const { publicKey } = wallet.currentWallet;
      const { type } = wallet.currentWallet;
      const typeScript = createScriptObj(publicKey, type, address);
      const txs = address ? await getTxHistories(typeScript) : [];

      chrome.runtime.sendMessage({
        txs,
        type: MESSAGE_TYPE.SEND_TX_HISTORY,
      });
    });
  }

  // sign tx
  if (request.type === MESSAGE_TYPE.EXTERNAL_SIGN) {
    const responseMsg = {
      type: request.type,
      // extension does not allow to send to web page(injected script) directly
      // content script will receive it and forward to web page
      target: WEB_PAGE,
      success: false,
      message: 'tx failed to sign',
      data: {
        tx: null,
      },
    };

    const notificationMsg = {
      type: 'basic',
      iconUrl: 'logo-32.png',
      title: 'TX failed to sign',
      message: 'Your TX failed to send',
    };

    try {
      const signedTx = await signTxFromMsg(request);

      responseMsg.data.tx = signedTx;
      responseMsg.message = 'tx is signed';
      responseMsg.success = true;

      notificationMsg.title = 'TX Signed';
      notificationMsg.message = 'Your TX has been signed';
    } catch (error) {
      console.error('error happened when signing tx: ', error);
    }

    sendToWebPage(responseMsg);

    browser.notifications.create(notificationMsg);
  }

  // sign and send tx
  if (request.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND) {
    const responseMsg = {
      type: request.type,
      // extension does not allow to send to web page(injected script) directly
      // content script will receive it and forward to web page
      target: WEB_PAGE,
      success: false,
      message: 'tx failed to send',
      data: {
        hash: null,
      },
    };

    const notificationMsg = {
      type: 'basic',
      iconUrl: 'logo-32.png',
      title: 'TX failed to sign',
      message: 'Your TX failed to send',
    };

    try {
      const signedTx = await signTxFromMsg(request);
      const sentTxHash = await sendSignedTx(signedTx);

      responseMsg.data.hash = sentTxHash;
      responseMsg.message = 'tx is sent';
      responseMsg.success = true;

      notificationMsg.title = 'TX Sent';
      notificationMsg.message = 'tx is sent';
    } catch (error) {
      console.error('error happened when sending tx: ', error);
    }

    sendToWebPage(responseMsg);

    browser.notifications.create(notificationMsg);
  }

  // send tx
  if (request.type === MESSAGE_TYPE.EXTERNAL_SEND) {
    console.log('get EXTERNAL_SEND mesage ============= ');
    const responseMsg = {
      type: request.type,
      // extension does not allow to send to web page(injected script) directly
      // content script will receive it and forward to web page
      target: WEB_PAGE,
      success: false,
      message: 'tx failed to send',
      data: {
        hash: null,
      },
    };

    const notificationMsg = {
      type: 'basic',
      iconUrl: 'logo-32.png',
      title: 'TX failed to sign',
      message: 'Your TX failed to send',
    };

    try {
      const sentTxHash = await sendSignedTx(request.data?.tx);

      responseMsg.data.hash = sentTxHash;
      responseMsg.message = 'tx is sent';
      responseMsg.success = true;

      notificationMsg.title = 'TX Sent';
      notificationMsg.message = 'tx is sent';
    } catch (error) {
      console.error('error happened when sending tx: ', error);
    }

    sendToWebPage(responseMsg);

    browser.notifications.create(notificationMsg);
  }

  // send transactioin
  if (request.type === MESSAGE_TYPE.REQUEST_SEND_TX) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async (result) => {
      const toAddress = request.address.trim();
      const capacity = request.capacity * 10 ** 8;
      const fee = request.fee * 10 ** 8;
      const password = request.password.trim();
      const toData = request.data.trim();
      const {
        address: fromAddress,
        publicKey,
        lock: lockHash,
        type: lockType,
      } = result.currentWallet;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
      const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
      const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
      const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

      const responseMsg = {
        type: MESSAGE_TYPE.SEND_TX_OVER,
        success: false,
        message: 'Failed to send tx',
        data: {
          hash: '',
          tx: {
            from: fromAddress,
            to: toAddress,
            amount: capacity.toString(),
            fee: fee.toString(),
            hash: '',
            status: 'Pending',
            blockNum: 'Pending',
          },
        },
      };

      try {
        const sendTxHash = await sendTransaction(
          privateKey,
          fromAddress,
          toAddress,
          BigInt(capacity),
          BigInt(fee),
          lockHash,
          lockType,
          password,
          publicKey.replace('0x', ''),
          toData,
        );
        responseMsg.data.hash = sendTxHash;
        responseMsg.data.tx.hash = sendTxHash;
        responseMsg.success = true;
        responseMsg.message = 'TX is sent';
      } catch (error) {
        responseMsg.message = `${responseMsg.message}: ${error}`;
      }

      // sedb back to extension UI
      chrome.runtime.sendMessage(responseMsg);
    });
  }

  // transactioin detail
  if (request.type === MESSAGE_TYPE.REQUEST_TX_DETAIL) {
    const { txHash } = request.message;
    const { capacity } = request.message;
    const { fee } = request.message;
    const inputs = request.message.fromAddress;
    const outputs = request.message.toAddress;
    const status = await getStatusByTxHash(txHash);
    const blockNumber = await getBlockNumberByTxHash(txHash);
    chrome.runtime.sendMessage({
      status,
      capacity,
      fee,
      inputs,
      outputs,
      txHash,
      blockNumber: blockNumber.toString(),
      type: MESSAGE_TYPE.TX_DETAIL,
    });
  }

  // export-private-key check
  if (request.type === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async (result) => {
      const { password } = request;
      const { publicKey } = result.currentWallet;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);

      const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
      const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
      const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

      // check the password
      if (!(privateKey.startsWith('0x') && privateKey.length === 64)) {
        chrome.runtime.sendMessage({
          isValidatePassword: false,
          type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        });
      }
      const keystore = WalletKeystore.encrypt(privateKeyBuffer.data, password);

      chrome.runtime.sendMessage({
        isValidatePassword: true,
        keystore,
        privateKey,
        type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
      });
    });
  }

  // export-private-key-second check
  if (request.type === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND) {
    const { privateKey } = request.message;
    const { keystore } = request.message;

    chrome.runtime.sendMessage({
      privateKey,
      keystore: JSON.stringify(keystore),
      type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT,
    });
  }

  // export-mneonic check
  if (request.type === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async (result) => {
      const { password } = request;
      const { publicKey } = result.currentWallet;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
      const { entropyKeystore } = wallet;

      // check the password
      const entropy = await PasswordKeystore.decrypt(entropyKeystore, password);

      // send the check result to the page
      if (_.isEmpty(entropy)) {
        chrome.runtime.sendMessage({
          isValidatePassword: false,
          type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        });
      }

      chrome.runtime.sendMessage({
        isValidatePassword: true,
        password,
        entropyKeystore,
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
      });
    });
  }

  // export-mneonic-second check
  if (request.type === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND) {
    const { password } = request.message;
    const { entropyKeystore } = request.message;

    const entropy = await PasswordKeystore.decrypt(entropyKeystore, password);
    const mnemonic = entropyToMnemonic(entropy);

    chrome.runtime.sendMessage({
      // mnemonic: JSON.stringify(mnemonic),
      mnemonic,
      type: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT,
    });
  }

  // import private key
  if (request.type === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async (result) => {
      let privateKey: string = request.privateKey.trim();
      privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const publicKey = ckbUtils.privateKeyToPublicKey(privateKey);
      const password = request.password.trim();

      // get the current keystore and check the password
      const currentPublicKey = result.currentWallet.publicKey;
      const currWallet = findInWalletsByPublicKey(currentPublicKey, result.wallets);
      const currKeystore = currWallet.keystore;
      const privateKeyObj = await PasswordKeystore.checkByPassword(currKeystore, password);
      if (privateKeyObj == null) {
        chrome.runtime.sendMessage({
          // 'password incorrect',
          type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_ERR,
        });
        return;
      }

      // check the keystore exist or not by publicKey
      const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

      if (!_.isEmpty(addressesObj)) {
        const { addresses } = addressesObj;
        currentWallet = {
          publicKey,
          address: addresses[0].address,
          type: addresses[0].type,
          lock: addresses[0].lock,
        };
      } else {
        // 'No '0x'
        if (privateKey.startsWith('0x')) {
          privateKey = privateKey.substr(2);
        }
        const accounts = await addKeyperWallet(privateKey, password, '', '');
        // add addresses indexer
        await indexerAddresses(accounts);

        wallets = getWallets();
        addressesList = getAddressesList();
        currentWallet = getCurrentWallet();
      }

      saveToStorage(wallets, currentWallet, addressesList);

      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK,
      });
    });
  }

  /**
   * import keystore
   * 1- check the kPassword(keystore password) by the keystore
   * 2- check the uPassword(synpase) by the currentWallet
   * 3- get the privateKey by the keystore
   * 4- create the keystore(passworder) by the privatekey
   */
  if (request.type === MESSAGE_TYPE.IMPORT_KEYSTORE) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async (result) => {
      // 01- get the params from request
      const keystore = request.keystore.trim();
      const kPassword = request.keystorePassword.trim();
      const uPassword = request.userPassword.trim();

      // 02- check the keystore by the keystorePassword
      if (!WalletKeystore.checkPasswd(keystore, kPassword)) {
        chrome.runtime.sendMessage({
          // 'password incorrect',
          type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERROR_KPASSWORD,
        });
        return;
      }

      // 021- check the synapse password by the currentWallet Keystore
      const currentPublicKey = result.currentWallet.publicKey;
      const currWallet = findInWalletsByPublicKey(currentPublicKey, result.wallets);
      const currKeystore = currWallet.keystore;
      const privateKeyObj = await PasswordKeystore.checkByPassword(currKeystore, uPassword);
      if (privateKeyObj == null) {
        chrome.runtime.sendMessage({
          // 'password incorrect',
          type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERROR_UPASSWORD,
        });
        return;
      }

      // 03 - get the private by input keystore
      const privateKey = await WalletKeystore.decrypt(keystore, kPassword);
      const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);
      // check the keystore exist or not by the publicKey
      const addressesObj = findInAddressesListByPublicKey(publicKey, addressesList);

      if (!_.isEmpty(addressesObj)) {
        const { addresses } = addressesObj;
        currentWallet = {
          publicKey,
          address: addresses[0].address,
          type: addresses[0].type,
          lock: addresses[0].lock,
        };
      } else {
        const accounts = await addKeyperWallet(privateKey, uPassword, '', '');
        // add addresses indexer
        await indexerAddresses(accounts);

        wallets = getWallets();
        addressesList = getAddressesList();
        currentWallet = getCurrentWallet();
      }

      // 002-
      saveToStorage(wallets, currentWallet, addressesList);

      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_KEYSTORE_OK,
      });
    });
  }
});
