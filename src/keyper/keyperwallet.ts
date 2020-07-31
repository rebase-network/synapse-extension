import { SignatureAlgorithm } from '@keyper/specs/lib';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { scriptToAddress } from '@keyper/specs/lib/address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import _ from 'lodash';
import * as Keystore from '../wallet/passwordEncryptor';
import ContainerManager from './containerManager';
import init from './setupKeyper';

import { KEYSTORE_TYPE } from '../utils/constants';
import Address, { AddressPrefix } from '../wallet/address';

// eslint-disable-next-line import/order
const EC = require('elliptic').ec;

let wallets = [];
let currentWallet = {};
const addressesList = [];

const container = ContainerManager.getInstance().getContainer('testnet');
const addRules = [];

const generateKeystore = async (privateKey, password) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const ks = await Keystore.encrypt(privateKeyBuffer, password);
  return ks;
};

const setUpContainer = (publicKey) => {
  container.addPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });

  const scripts = container.getScripsByPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });

  scripts.forEach((script) => {
    const addRule = {
      name: 'LockHash',
      data: scriptToHash(script),
    };
    addRules.push(addRule);
  });
};

const generateByPrivateKey = (privateKey, password) => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString('hex');
  const ks = generateKeystore(privateKey, password);

  setUpContainer(publicKey);

  return ks;
};

const getAccounts = async (networkPrefix: string) => {
  const scripts = await container.getAllLockHashesAndMeta();
  const result = [];

  for (const script of scripts) {
    result.push({
      address: scriptToAddress(script.meta.script, { networkPrefix, short: true }),
      script: script.meta.script,
      type: script.meta.name,
      lock: script.hash,
      amount: 0,
    });
  }

  return result;
};

const signTx = async (lockHash, password, rawTx, config) => {
  const tx = await container.sign(
    {
      lockHash,
      password,
    },
    rawTx,
    config,
  );
  return tx;
};

const getAllLockHashesAndMeta = async () => {
  return container.getAllLockHashesAndMeta();
};

// privateKey No '0x'
async function addKeyperWallet(privateKey, password, entropyKeystore, rootKeystore, networkPrefix) {
  init();

  const keystore = await generateKeystore(privateKey, password);
  // prefix '0x'
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKey}`);
  // params publicKey No '0x'
  setUpContainer(publicKey.substr(2));

  // Keyper accounts
  const accounts = await getAccounts(networkPrefix);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await saveWallets(privateKey, keystore, accounts, entropyKeystore, rootKeystore);

  return accounts;
}

async function getWalletsInStorage() {
  const walletsObj = await browser.storage.local.get('wallets');

  if (Array.isArray(walletsObj.wallets)) {
    wallets = walletsObj.wallets;
  }
  return wallets;
}

// privateKey Not contain '0x'prefix
async function saveWallets(
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
    script: accounts[0].script,
    address: accounts[0].address,
    type: accounts[0].type,
    lock: accounts[0].lock,
  };

  currentWallet = currentAddress;
}

function getWallets() {
  return wallets;
}

function getAddressesList() {
  return addressesList;
}

function getCurrentWallet() {
  return currentWallet;
}

export { signTx, addKeyperWallet, getWallets, getAddressesList, getCurrentWallet };
