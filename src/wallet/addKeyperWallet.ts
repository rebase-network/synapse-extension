
import { KEYSTORE_TYPE } from '../utils/constants'
import Address, { AddressPrefix } from './address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'

const KeyperWallet = require('../keyper/keyperwallet');
const EC = require("elliptic").ec;

let wallets = [];
let currentWallet = {};
let addressesList = [];

//privateKey No '0x'
export async function addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore) {

  await KeyperWallet.init();

  const keystore = KeyperWallet.generateKeystore(privateKey, password);
  //prefix '0x'
  const publicKey = ckbUtils.privateKeyToPublicKey('0x' + privateKey);
  //params publicKey No '0x'
  KeyperWallet.setUpContainer(publicKey.substr(2));

  //Keyper accounts
  const accounts = await KeyperWallet.accounts()

  saveWallets(privateKey, keystore, accounts, entropyKeystore, rootKeystore);

}

//3- Type
//privateKey Not contain '0x'prefix
export function saveWallets(privateKey, keystore, accounts, entropyKeystore, rootKeystore, prefix = AddressPrefix.Testnet) {

  const addressObj = Address.fromPrivateKey(privateKey, prefix);
  const blake160 = addressObj.getBlake160(); //publicKeyHash
  const publicKey = ckbUtils.privateKeyToPublicKey("0x" + privateKey);

  const walletCommon = {
    publicKey: publicKey,
    blake160: blake160,
    entropyKeystore: entropyKeystore,
    rootKeystore: rootKeystore,
    keystore: keystore,
    keystoreType: KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE,
  }
  wallets.push(walletCommon)

  const addressesObj = {
    publicKey: publicKey,
    addressesList: accounts
  }
  addressesList.push(addressesObj);

  const currentAddress = {
    publicKey: publicKey,
    address: accounts[0],
  }

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
    nPublicKey = '0x' + publicKey;
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
