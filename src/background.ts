import { MESSAGE_TYPE, ADDRESS_TYPE_CODEHASH } from './utils/constants';
import {
  mnemonicToSeedSync,
  validateMnemonic,
  mnemonicToEntropy,
  entropyToMnemonic,
} from './wallet/mnemonic';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { generateMnemonic } from './wallet/key';
import Keychain from './wallet/keychain';
import { ExtendedPrivateKey } from './wallet/key';
import { sendSimpleTransaction } from './sendSimpleTransaction';
import { getStatusByTxHash, getBlockNumberByTxHash } from './transaction_del';
import Address from './wallet/address';
import { getTxHistories, createScriptObj } from './background/transaction';
import {
  addKeyperWallet,
  getAddressesList,
  getCurrentWallet,
  getWallets,
} from './wallet/addKeyperWallet';
import * as WalletKeystore from './wallet/keystore';
import * as PasswordKeystore from './wallet/passwordEncryptor';
import * as _ from 'lodash';

/**
 * Listen messages from popup
 */
let wallets = [];
let currentWallet = {};
let addressesList = [];

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  //IMPORT_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
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

    //store the mnemonic entropy
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
    saveToStorage();

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
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
    const entropyKeystore = PasswordKeystore.encrypt(Buffer.from(entropy, 'hex'), password);

    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    const rootKeystore = PasswordKeystore.encrypt(
      Buffer.from(extendedKey.serialize(), 'hex'),
      password,
    );

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
    ///
    chrome.storage.local.get(['currentWallet'], async function (wallet) {
      const address = wallet.currentWallet ? wallet.currentWallet.address : undefined;
      const publicKey = wallet.currentWallet.publicKey;
      const type = wallet.currentWallet.type;
      const typeScript = createScriptObj(publicKey, type, address);
      const txs = address ? await getTxHistories(typeScript) : [];

      chrome.runtime.sendMessage({
        txs,
        messageType: MESSAGE_TYPE.SEND_TX_HISTORY,
      });
    });
  }

  if (request.messageType === 'xxxx') {
    const tx = {
      hash: '0x670133ec69d03de5f76f320b38c434cb474620d961c0dcecc5b73f64c3755947',
      blockNum: 190532,
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
      const capacity = request.capacity * 10 ** 8;
      const fee = request.fee * 10 ** 8;
      const password = request.password.trim();
      const { address: fromAddress, publicKey, lock: lockHash } = result.currentWallet;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
      const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
      const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
      const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

      const sendTxHash = await sendSimpleTransaction(
        privateKey,
        fromAddress,
        toAddress,
        BigInt(capacity),
        BigInt(fee),
        lockHash,
      );

      chrome.runtime.sendMessage({
        tx: {
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: capacity.toString(),
          fee: fee.toString(),
          hash: sendTxHash,
          status: 'Pending',
          blockNum: 'Pending',
        },
        messageType: MESSAGE_TYPE.TO_TX_DETAIL,
      });
    });
  }

  //transactioin detail
  if (request.messageType === MESSAGE_TYPE.REQUEST_TX_DETAIL) {
    const txHash = request.message.txHash;
    const capacity = request.message.capacity;
    const fee = request.message.fee;
    const inputs = request.message.fromAddress;
    const outputs = request.message.toAddress;
    const status = await getStatusByTxHash(txHash);
    let blockNumber = await getBlockNumberByTxHash(txHash);
    chrome.runtime.sendMessage({
      status,
      capacity,
      fee,
      inputs,
      outputs,
      txHash,
      blockNumber: blockNumber.toString(),
      messageType: MESSAGE_TYPE.TX_DETAIL,
    });
  }

  //export-private-key check
  if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async function (result) {
      const password = request.password;
      const publicKey = result.currentWallet.publicKey;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);

      const privateKeyBuffer = await PasswordKeystore.decrypt(wallet.keystore, password);
      const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
      const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

      //check the password
      if (!(privateKey.startsWith('0x') && privateKey.length == 64)) {
        chrome.runtime.sendMessage({
          isValidatePassword: false,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        });
      }
      const keystore = WalletKeystore.encrypt(Buffer.from(privateKey, 'hex'), password);

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
    chrome.storage.local.get(['currentWallet', 'wallets'], async function (result) {
      const password = request.password;
      const publicKey = result.currentWallet.publicKey;
      const wallet = findInWalletsByPublicKey(publicKey, result.wallets);
      const entropyKeystore = wallet.entropyKeystore;

      //check the password
      const entropy = await PasswordKeystore.decrypt(entropyKeystore, password);

      //send the check result to the page
      if (_.isEmpty(entropy)) {
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

    const entropy = await PasswordKeystore.decrypt(entropyKeystore, password);
    const mnemonic = entropyToMnemonic(entropy);

    chrome.runtime.sendMessage({
      // mnemonic: JSON.stringify(mnemonic),
      mnemonic,
      messageType: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT,
    });
  }

  // import private key
  if (request.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async function (result) {
      let privateKey: string = request.privateKey.trim();
      privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const publicKey = ckbUtils.privateKeyToPublicKey(privateKey);
      const password = request.password.trim();

      //get the current keystore and check the password
      const currentPublicKey = result.currentWallet.publicKey;
      const currWallet = findInWalletsByPublicKey(currentPublicKey, result.wallets);
      const currKeystore = currWallet.keystore;
      const privateKeyObj = await PasswordKeystore.checkByPassword(currKeystore, password);
      if (privateKeyObj == null) {
        chrome.runtime.sendMessage({
          //'password incorrect',
          messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_ERR,
        });
        return;
      }

      //check the keystore exist or not by publicKey
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
        //'No '0x'
        if (privateKey.startsWith('0x')) {
          privateKey = privateKey.substr(2);
        }
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

  /**
   * import keystore
   * 1- check the kPassword(keystore password) by the keystore
   * 2- check the uPassword(synpase) by the currentWallet
   * 3- get the privateKey by the keystore
   * 4- create the keystore(passworder) by the privatekey
   */
  if (request.messageType === MESSAGE_TYPE.IMPORT_KEYSTORE) {
    chrome.storage.local.get(['currentWallet', 'wallets'], async function (result) {
      //01- get the params from request
      const keystore = request.keystore.trim();
      const kPassword = request.keystorePassword.trim();
      const uPassword = request.userPassword.trim();

      //02- check the keystore by the keystorePassword
      if (!WalletKeystore.checkPasswd(keystore, kPassword)) {
        chrome.runtime.sendMessage({
          //'password incorrect',
          messageType: MESSAGE_TYPE.IMPORT_KEYSTORE_ERROR_KPASSWORD,
        });
        return;
      }

      //021- check the synapse password by the currentWallet Keystore
      const currentPublicKey = result.currentWallet.publicKey;
      const currWallet = findInWalletsByPublicKey(currentPublicKey, result.wallets);
      const currKeystore = currWallet.keystore;
      const privateKeyObj = await PasswordKeystore.checkByPassword(currKeystore, uPassword);
      if (privateKeyObj == null) {
        chrome.runtime.sendMessage({
          //'password incorrect',
          messageType: MESSAGE_TYPE.IMPORT_KEYSTORE_ERROR_UPASSWORD,
        });
        return;
      }

      //03 - get the private by input keystore
      const privateKey = await WalletKeystore.decrypt(keystore, kPassword);
      const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);
      //check the keystore exist or not by the publicKey
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
