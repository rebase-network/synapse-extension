import { SignatureAlgorithm } from '@keyper/specs/lib';
import { scriptToAddress } from '@keyper/specs/lib/address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import * as Keystore from '../wallet/passwordEncryptor';
import ContainerManager from './containerManager';
import init from './setupKeyper';
import { KEYSTORE_TYPE } from '../utils/constants';
import Address, { AddressPrefix } from '../wallet/address';

// FIXME: need to add mainnet support
const container = ContainerManager.getInstance().getContainer('testnet');

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
};

const getAccounts = async (networkPrefix: string) => {
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

const getWallets = async () => {
  const walletsObj = await browser.storage.local.get('wallets');

  return walletsObj.wallets || [];
};

const getAddressesList = async () => {
  const { addressesList = [] } = await browser.storage.local.get('addressesList');
  return addressesList;
};

const getCurrentWallet = async () => {
  const { currentWallet = {} } = await browser.storage.local.get('currentWallet');
  return currentWallet;
};

const setWallets = async (wallets) => {
  await browser.storage.local.set({
    wallets,
  });
};
const setCurrentWallet = async (currentWallet) => {
  await browser.storage.local.set({
    currentWallet,
  });
};
const setAddressesList = async (addressesList) => {
  await browser.storage.local.set({
    addressesList,
  });
};

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

  const oldWallets = await getWallets();

  const walletCommon = {
    publicKey,
    blake160,
    entropyKeystore,
    rootKeystore,
    keystore,
    keystoreType: KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE,
  };

  const wallets = oldWallets.push(walletCommon);

  const addressesObj = {
    publicKey,
    addresses: accounts,
  };

  const oldAddressesList = await getAddressesList();

  const addressesList = oldAddressesList.push(addressesObj);

  const currentWallet = {
    publicKey,
    script: accounts[0].script,
    address: accounts[0].address,
    type: accounts[0].type,
    lock: accounts[0].lock,
  };

  browser.storage.local.set({
    wallets,
    addressesList,
    currentWallet,
  });
}

export {
  signTx,
  addKeyperWallet,
  getWallets,
  getAddressesList,
  getCurrentWallet,
  setWallets,
  setCurrentWallet,
  setAddressesList,
};
