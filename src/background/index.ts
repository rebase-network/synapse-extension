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
} from '@src/keyper/keyperwallet';
import * as WalletKeystore from '@src/wallet/keystore';
import * as PasswordKeystore from '@src/wallet/passwordEncryptor';
import _ from 'lodash';
import {
  saveToStorage,
  findInWalletsByPublicKey,
  findInAddressesListByPublicKey,
  showAddressHelper,
} from '@utils/wallet';
import { getStatusByTxHash, getBlockNumberByTxHash, sendSignedTx } from '@utils/transaction';
import { MESSAGE_TYPE, CKB_TOKEN_DECIMALS } from '@utils/constants';
import addExternalMessageListener from '@background/messageHandlers';
import { WEB_PAGE } from '@src/utils/message/constants';
import { sendToWebPage } from '@background/messageHandlers/proxy';
import NetworkManager from '@common/networkManager';

NetworkManager.initNetworks();

let wallets = [];
let currentWallet = {};
let addressesList = [];

addExternalMessageListener();

chrome.runtime.onMessage.addListener(async (request) => {
  const currentNetwork = await NetworkManager.getCurrentNetwork();
  const { prefix } = currentNetwork;

  // IMPORT_MNEMONIC
  if (request.type === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();

    // check mnemonic
    const isValidateMnemonic = validateMnemonic(mnemonic);
    if (!isValidateMnemonic) {
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_INVALID_MNEMONIC);
      return;
    }

    // store the mnemonic entropy
    const entropy = mnemonicToEntropy(mnemonic);
    const entropyKeystore = await PasswordKeystore.encrypt(Buffer.from(entropy, 'hex'), password);

    // check words
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
        script: addresses[0].script,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      // Add Keyper to Synapse
      await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore, prefix);

      wallets = await getWallets();
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

    const isValidateMnemonic = validateMnemonic(mnemonic);

    if (!isValidateMnemonic) {
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_INVALID_MNEMONIC);
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
        script: addresses[0].script,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      // Add Keyper to Synapse
      await addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore, prefix);

      wallets = await getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }

    // 002-saveToStorage
    saveToStorage(wallets, currentWallet, addressesList);

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
  }

  // get tx history by address
  if (request.type === MESSAGE_TYPE.GET_TX_HISTORY) {
    const cwStorage = await browser.storage.local.get('currentWallet');

    const address = cwStorage.currentWallet ? cwStorage.currentWallet.address : undefined;
    const lockHash = cwStorage.currentWallet ? cwStorage.currentWallet.lock : undefined;
    const txs = address ? await getTxHistories(lockHash) : [];
    chrome.runtime.sendMessage({
      txs,
      type: MESSAGE_TYPE.SEND_TX_HISTORY,
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

    const notificationMsg: browser.notifications.CreateNotificationOptions = {
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

    const notificationMsg: browser.notifications.CreateNotificationOptions = {
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

    const notificationMsg: browser.notifications.CreateNotificationOptions = {
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
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletsStorage = await browser.storage.local.get('wallets');
    const currNetworkStorage = await browser.storage.local.get('currentNetwork');

    const toAddress = request.address.trim();
    const capacity = request.capacity * CKB_TOKEN_DECIMALS;
    const fee = request.fee * CKB_TOKEN_DECIMALS;
    const password = request.password.trim();
    const toData = request.data.trim();

    const { script, publicKey, lock: lockHash, type: lockType } = cwStorage.currentWallet;

    const fromAddress = showAddressHelper(currNetworkStorage.currentNetwork.prefix, script);

    const wallet = findInWalletsByPublicKey(publicKey, walletsStorage.wallets);
    const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
    if (privateKeyBuffer === null) {
      const responseEorrorMsg = {
        type: MESSAGE_TYPE.SEND_TX_ERROR,
        success: true,
        message: 'INVALID_PASSWORD',
        data: '',
      };
      browser.runtime.sendMessage(responseEorrorMsg);
      return;
    }
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

      if (sendTxHash.errCode !== undefined && sendTxHash.errCode !== 0) {
        const responseEorrorMsg = {
          type: MESSAGE_TYPE.SEND_TX_ERROR,
          success: true,
          message: sendTxHash.errMsg,
          data: '',
        };
        chrome.runtime.sendMessage(responseEorrorMsg);
        return;
      }
      responseMsg.data.hash = sendTxHash;
      responseMsg.data.tx.hash = sendTxHash;
      responseMsg.success = true;
      responseMsg.message = 'TX is sent';
    } catch (error) {
      responseMsg.message = `${responseMsg.message}: ${error}`;
    }

    // sedb back to extension UI
    chrome.runtime.sendMessage(responseMsg);
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
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletsStorage = await browser.storage.local.get('wallets');
    const { password } = request;
    const { publicKey } = cwStorage.currentWallet;

    const wallet = findInWalletsByPublicKey(publicKey, walletsStorage.wallets);
    const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
    if (privateKeyBuffer === null) {
      browser.runtime.sendMessage({
        isValidatePassword: false,
        type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
      });
      return;
    }
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
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletsStorage = await browser.storage.local.get('wallets');
    const { password } = request;
    const { publicKey } = cwStorage.currentWallet;
    const wallet = findInWalletsByPublicKey(publicKey, walletsStorage.wallets);
    const { entropyKeystore } = wallet;
    if (_.isEmpty(entropyKeystore)) {
      chrome.runtime.sendMessage({
        isValidateEntropy: false,
        isValidatePassword: true,
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
      });
      return;
    }
    // check the password
    const entropy = await PasswordKeystore.decrypt(entropyKeystore, password);
    // send the check result to the page
    if (entropy === null) {
      browser.runtime.sendMessage({
        isValidateEntropy: true,
        isValidatePassword: false,
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
      });
      return;
    }

    chrome.runtime.sendMessage({
      isValidateEntropy: true,
      isValidatePassword: true,
      entropy,
      type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
    });
  }

  // export-mneonic-second check
  if (request.type === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND) {
    const { entropy } = request.message;
    const mnemonic = entropyToMnemonic(entropy);
    chrome.runtime.sendMessage({
      mnemonic,
      type: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT,
    });
  }

  // import private key
  if (request.type === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletStorage = await browser.storage.local.get('wallets');

    let privateKey: string = request.privateKey.trim();
    privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    let publicKey = '';
    try {
      publicKey = ckbUtils.privateKeyToPublicKey(privateKey);
    } catch (error) {
      browser.runtime.sendMessage({
        message: 'INVALID_PRIVATEKEY',
        type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_ERR,
      });
      return;
    }

    const password = request.password.trim();

    // get the current keystore and check the password
    const currentPublicKey = cwStorage.currentWallet.publicKey;
    const currWallet = findInWalletsByPublicKey(currentPublicKey, walletStorage.wallets);
    const currKeystore = currWallet.keystore;
    const privateKeyObj = await PasswordKeystore.decrypt(currKeystore, password);
    if (privateKeyObj === null) {
      browser.runtime.sendMessage({
        message: 'INVALID_PASSWORD',
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
        script: addresses[0].script,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      // 'No '0x'
      if (privateKey.startsWith('0x')) {
        privateKey = privateKey.substr(2);
      }
      await addKeyperWallet(privateKey, password, '', '', prefix);

      wallets = await getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }

    saveToStorage(wallets, currentWallet, addressesList);

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK,
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
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletsStorage = await browser.storage.local.get('wallets');

    // 01- get the params from request
    const keystore = request.keystore.trim();
    const kPassword = request.keystorePassword.trim();
    const uPassword = request.userPassword.trim();

    // 02- check the keystore by the keystorePassword
    let isValidPassword = false;
    try {
      isValidPassword = WalletKeystore.checkPasswd(keystore, kPassword);
    } catch (error) {
      browser.runtime.sendMessage({
        message: 'INVALID_KEYSTORE',
        type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERR,
      });
      return;
    }

    if (!isValidPassword) {
      browser.runtime.sendMessage({
        // 'password incorrect',
        message: 'INVALID_KEYSTORE_PASSWORD',
        type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERR,
      });
      return;
    }

    // 021- check the synapse password by the currentWallet Keystore
    const currentPublicKey = cwStorage.currentWallet.publicKey;
    const currWallet = findInWalletsByPublicKey(currentPublicKey, walletsStorage.wallets);
    const currKeystore = currWallet.keystore;
    const privateKeyObj = await PasswordKeystore.decrypt(currKeystore, uPassword);

    if (privateKeyObj === null) {
      browser.runtime.sendMessage({
        message: 'INVALID_WALLET_PASSWORD',
        type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERR,
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
        script: addresses[0].script,
        address: addresses[0].address,
        type: addresses[0].type,
        lock: addresses[0].lock,
      };
    } else {
      await addKeyperWallet(privateKey, uPassword, '', '', prefix);

      wallets = await getWallets();
      addressesList = getAddressesList();
      currentWallet = getCurrentWallet();
    }
    // 002-
    saveToStorage(wallets, currentWallet, addressesList);

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.IMPORT_KEYSTORE_OK,
    });
  }

  if (request.type === MESSAGE_TYPE.DELETE_WALLET) {
    const cwStorage = await browser.storage.local.get('currentWallet');
    const walletsStorage = await browser.storage.local.get('wallets');

    const password = request.password.trim();

    const currentPublicKey = cwStorage.currentWallet.publicKey;
    const currWallet = findInWalletsByPublicKey(currentPublicKey, walletsStorage.wallets);
    const currKeystore = currWallet.keystore;
    const privKeyObj = await PasswordKeystore.decrypt(currKeystore, password);

    if (privKeyObj === null) {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.DELETE_WALLET_ERR,
      });
      return;
    }

    browser.storage.local.clear();
    localStorage.clear();

    browser.runtime.sendMessage({
      type: MESSAGE_TYPE.DELETE_WALLET_OK,
    });
  }
});
