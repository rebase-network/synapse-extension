import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import * as _ from 'lodash';
import { KEYSTORE_TYPE } from '../utils/constants';
import Address, { AddressPrefix } from './address';

const KeyperWallet = require('../keyper/keyperwallet');

let wallets = [];
let currentWallet = {};
const addressesList = [];

// privateKey No '0x'
export async function addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore) {
  await KeyperWallet.init();

  const keystore = await KeyperWallet.generateKeystore(privateKey, password);
  // prefix '0x'
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);
  // params publicKey No '0x'
  KeyperWallet.setUpContainer(publicKey.substr(2));

  // Keyper accounts
  const accounts = await KeyperWallet.accounts();

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await saveWallets(privateKey, keystore, accounts, entropyKeystore, rootKeystore);
}

function loadWalletsInStorage() {
  return new Promise((resolve) => {
    // eslint-disable-next-line func-names
    chrome.storage.local.get('wallets', function (items) {
      resolve(items.wallets);
    });
  });
}

export async function getWalletsInStorage() {
  const walletsObj = await loadWalletsInStorage();
  if (Array.isArray(walletsObj)) {
    wallets = walletsObj;
  }
  return wallets;
}

// 3- Type
// privateKey Not contain '0x'prefix
export async function saveWallets(
  privateKey,
  keystore,
  accounts,
  entropyKeystore,
  rootKeystore,
  prefix = AddressPrefix.Testnet,
) {
  const addressObj = Address.fromPrivateKey(privateKey, prefix);
  const blake160 = addressObj.getBlake160(); // publicKeyHash
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);

  wallets = await getWalletsInStorage();
  if (_.isEmpty(wallets)) {
    wallets = [];
  }
  const walletCommon = {
    publicKey,
    blake160,
    entropyKeystore,
    rootKeystore,
    keystore,
    keystoreType: KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE,
  };
  wallets.push(walletCommon);

  const addressesObj = {
    publicKey,
    addresses: accounts,
  };
  addressesList.push(addressesObj);

  const currentAddress = {
    publicKey,
    address: accounts[0].address,
    type: accounts[0].type,
    lock: accounts[0].lock,
  };

  currentWallet = currentAddress;
}

export function getWallets() {
  return wallets;
}

export function getAddressesList() {
  return addressesList;
}

export function getCurrentWallet() {
  return currentWallet;
}

// eslint-disable-next-line no-shadow
function findKeystoreInWallets(wallets, publicKey) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet.keystore;
}

export async function getKeystoreFromWallets(publicKey) {
  let nPublicKey = publicKey;
  if (!publicKey.startsWith('0x')) {
    nPublicKey = `0x${publicKey}`;
  }
  wallets = await getWalletsInStorage();
  const ks = findKeystoreInWallets(wallets, nPublicKey);
  // keys[nPublicKey]
  return ks;
}

export async function signTx(lockHash, password, rawTransaction, config, publicKey) {
  return KeyperWallet.signTx(lockHash, password, rawTransaction, config, publicKey);
}
