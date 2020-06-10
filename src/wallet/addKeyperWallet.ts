import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { KEYSTORE_TYPE } from '../utils/constants';
import Address, { AddressPrefix } from './address';

const KeyperWallet = require('../keyper/keyperwallet');
const EC = require('elliptic').ec;

const wallets = [];
let currentWallet = {};
const addressesList = [];

// privateKey No '0x'
export async function addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore) {
  await KeyperWallet.init();

  const keystore = await KeyperWallet.generateByPrivateKey(privateKey, password);
  // prefix '0x'
  // const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);
  // params publicKey No '0x'
  // KeyperWallet.setUpContainer(publicKey.substr(2));

  // Keyper accounts
  const accounts = await KeyperWallet.accounts();

  saveWallets(privateKey, keystore, accounts, entropyKeystore, rootKeystore);
}

// 3- Type
// privateKey Not contain '0x'prefix
export function saveWallets(
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

export function getKeystoreFromWallets(publicKey) {
  let nPublicKey = publicKey;
  if (!publicKey.startsWith('0x')) {
    nPublicKey = `0x${publicKey}`;
  }
  const ks = findKeystoreInWallets(wallets, nPublicKey);
  // keys[nPublicKey]
  return ks;
}

function findKeystoreInWallets(wallets, publicKey) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet.keystore;
}

export async function signTx(lockHash, password, rawTransaction, config) {
  return KeyperWallet.signTx(lockHash, password, rawTransaction, config);
}
