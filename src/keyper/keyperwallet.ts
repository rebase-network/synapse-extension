import { scriptToAddress } from '@keyper/specs/lib/address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import * as Keystore from '../wallet/passwordEncryptor';
import ContainerManager from './containerManager';
import { KEYSTORE_TYPE } from '../utils/constants';
import Address, { AddressPrefix } from '../wallet/address';

const containerManager = ContainerManager.getInstance();

const generateKeystore = async (privateKey, password) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const ks = await Keystore.encrypt(privateKeyBuffer, password);
  return ks;
};

const getAccounts = async (networkPrefix: string) => {
  const container = await containerManager.getCurrentContainer();
  const scripts = await container.getAllLockHashesAndMeta();
  const result = scripts.map((script) => {
    return {
      address: scriptToAddress(script.meta.script, { networkPrefix, short: true }),
      script: script.meta.script,
      type: script.meta.name,
      lock: script.hash,
      amount: 0,
    };
  });

  return result;
};

export const getWallets = async () => {
  const { wallets = [] } = await browser.storage.local.get('wallets');
  return wallets;
};

export const getPublicKeys = async () => {
  const { publicKeys = [] } = await browser.storage.local.get('publicKeys');
  return publicKeys;
};

export const getAddressesList = async () => {
  const { addressesList = [] } = await browser.storage.local.get('addressesList');
  return addressesList;
};

export const getCurrentWallet = async () => {
  const { currentWallet = {} } = await browser.storage.local.get('currentWallet');
  return currentWallet;
};

export const setCurrentWallet = async (currentWallet) => {
  await browser.storage.local.set({
    currentWallet,
  });
};

export const setAddressesList = async (addressesList) => {
  await browser.storage.local.set({
    addressesList,
  });
};

export const signTx = async (lockHash, password, rawTx, config, others = {}) => {
  const container = await containerManager.getCurrentContainer();
  const context = {
    lockHash,
    password,
    ...others,
  };
  const tx = await container.sign(context, rawTx, config);
  return tx;
};

// privateKey No '0x'
export async function addKeyperWallet(
  privateKey,
  password,
  entropyKeystore,
  rootKeystore,
  networkPrefix,
) {
  const privateKeyWithout0x = privateKey.startsWith('0x') ? privateKey.substr(2) : privateKey;
  const keystore = await generateKeystore(privateKeyWithout0x, password);
  // has prefix '0x'
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKeyWithout0x}`);

  containerManager.addPublicKeyForAllContainers(publicKey);

  // Keyper accounts
  const accounts = await getAccounts(networkPrefix);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await saveWallets(privateKeyWithout0x, keystore, accounts, entropyKeystore, rootKeystore);

  return accounts;
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

  // public key
  const publicKeys = await getPublicKeys();
  publicKeys.push(publicKey);

  // wallets
  const wallets = await getWallets();
  const walletCommon = {
    publicKey,
    blake160,
    entropyKeystore,
    rootKeystore,
    keystore,
    keystoreType: KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE,
  };
  wallets.push(walletCommon);

  // addresses
  const addressesObj = {
    publicKey,
    addresses: accounts,
  };
  const addressesList = await getAddressesList();
  addressesList.push(addressesObj);

  // current wallet
  const currentWallet = {
    publicKey,
    script: accounts[0].script,
    address: accounts[0].address,
    type: accounts[0].type,
    lock: accounts[0].lock,
  };

  // save all to storage
  await browser.storage.local.set({
    publicKeys,
    wallets,
    addressesList,
    currentWallet,
  });
}
