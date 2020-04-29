
import Address, { AddressPrefix } from './address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'
import { KEYSTORE_TYPE, Ckb } from '../utils/constants'

const KeyperWallet = require('../keyper/keyperwallet');
const EC = require("elliptic").ec;

let wallets = [];
let currentWallet = {};
let addresses = [];
// let keys = {};
export async function addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore) {

  await KeyperWallet.init();
  // await KeyperWallet.generateByPrivateKey(password, privateKey);

  const ks = KeyperWallet.generateKeystore(privateKey, password);
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString("hex");

  // keys = KeyperWallet.saveKeystore(ks, publicKey);
  KeyperWallet.setUpContainer(publicKey);

  saveWallets(privateKey, entropyKeystore, rootKeystore, ks);

  //Keyper accounts
  // const accounts = await KeyperWallet.accounts()
  // chrome.storage.sync.set({ accounts, }, () => {
  //   console.log('keyper accounts is set to storage: ' + JSON.stringify(accounts));
  // });

  // getKeystoreFromWallets(publicKey);
}

//3- Type
//privateKey 没有0x前缀
export function saveWallets(privateKey, entropyKeystore, rootKeystore, keystore, prefix = AddressPrefix.Testnet) {

  const addressObj = Address.fromPrivateKey(privateKey, prefix);
  const blake160 = addressObj.getBlake160(); //publicKeyHash
  const publicKey = ckbUtils.privateKeyToPublicKey("0x" + privateKey);
  const lockHash = ckbUtils.scriptToHash({
    hashType: "type",
    codeHash: Ckb.MainNetCodeHash,
    args: blake160,
  })

  const wallet = {
    "publicKey": publicKey, //get Keyper Store by pubicKey
    "path": addressObj.path, //ckt 有问题
    "blake160": blake160,
    "address": addressObj.address,
    "lockHash": lockHash,
    "entropyKeystore": entropyKeystore, //助记词
    "rootKeystore": rootKeystore, //Root
    "keystore": keystore,
    "keystoreType": KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE
  }

  wallets.push(wallet)

  const _address = {
    "address": addressObj.address,
    "walletIndex": wallets.length - 1
  }

  addresses.push(_address)
  currentWallet = wallets[_address.walletIndex];
}

export function getWallets() {
  return wallets;
}

export function getAddresses() {
  return addresses;
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
