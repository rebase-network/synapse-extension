import { LockHashWithMeta, PublicKey } from '@keyper/container';
import { SignatureAlgorithm, Script } from '@keyper/specs';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import PublicKeyClass from '@src/keyper/publicKey';
import * as Keystore from '@src/wallet/passwordEncryptor';
import ContainerManager from './containerManager';
import { KEYSTORE_TYPE } from '../utils/constants';

interface IAddressesList {
  publicKey: string;
  addresses: any[];
}

const containerManager = ContainerManager.getInstance();

const generateKeystore = async (privateKey, password) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const ks = await Keystore.encrypt(privateKeyBuffer, password);
  return ks;
};

export const getWallets = async () => {
  const { wallets = [] } = await browser.storage.local.get('wallets');
  return wallets;
};

export const getPublicKeys = async () => {
  const { publicKeys = [] } = await browser.storage.local.get('publicKeys');
  return publicKeys;
};

export const addPublicKey = async (publicKey: string) => {
  const { publicKeys = [] } = await browser.storage.local.get('publicKeys');
  if (!publicKeys.includes(publicKey)) {
    publicKeys.push(publicKey);
    await browser.storage.local.set({
      publicKeys,
    });
  }
  console.log('addPublicKey ---> after: ', publicKeys);
};

export const getCurrentWallet = async () => {
  const { currentWallet = {} } = await browser.storage.local.get('currentWallet');
  return currentWallet;
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

const getAddressesList = async () => {
  const container = await containerManager.getCurrentContainer();
  const publicKeys = await getPublicKeys();
  const lockHashWithMetas: LockHashWithMeta[] = await container.getAllLockHashesAndMeta();
  console.log(' getAddressesList ====> lockHashWithMetas: ', lockHashWithMetas);

  const result = publicKeys.map((publicKey) => {
    const addresses = lockHashWithMetas.map((lockHashWithMeta: LockHashWithMeta) => {
      const {
        hash: lockHash,
        meta: { name, script },
      } = lockHashWithMeta;
      return {
        script,
        type: name,
        lock: lockHash,
        amount: 0,
        lockHash,
      };
    });
    console.log(' aaaaa  getAllLockHashesAndMeta, addresses: ', addresses);
    return {
      publicKey,
      addresses,
    };
  });

  return result;
};

const getWalletInfoByPublicKey = async (publicKey: string) => {
  const container = await containerManager.getCurrentContainer();
  const lockHashWithMetas: LockHashWithMeta[] = await container.getAllLockHashesAndMeta();
  console.log(' ====  getWalletInfoByPublicKey, lockHashWithMetas: ', lockHashWithMetas);
  const publicKeyInstance = new PublicKeyClass(publicKey);
  const publicKeyWrapper: PublicKey = {
    payload: publicKey,
    algorithm: SignatureAlgorithm.secp256k1,
  };
  const scripts: Script[] = container.getScripsByPublicKey(publicKeyWrapper);
  const addresses = scripts.map((script) => {
    const lockHash = publicKeyInstance.getLockHash(script);
    console.log(' ------- lockHash: ', lockHash);
    const lockHashWithMeta = lockHashWithMetas.find((item: LockHashWithMeta) => {
      return lockHash === item.hash;
    });
    console.log(' ------- lockHashWithMeta: ', lockHashWithMeta);

    return {
      type: lockHashWithMeta?.meta?.name,
      script,
      lock: lockHash,
      lockHash,
      amount: 0,
    };
  });

  console.log(' aaaaa  getWalletInfoByPublicKey, addresses: ', addresses);
  return {
    publicKey,
    addresses,
  };
};

const updateAddressesList = async () => {
  const publicKeys = await getPublicKeys();
  console.log(' updateAddressesList ====> publicKeys: ', publicKeys);

  const addressesListPromise = publicKeys.map((publicKey) => {
    return getWalletInfoByPublicKey(publicKey);
  });
  const addressesList = await Promise.all(addressesListPromise);
  console.log(' updateAddressesList ====> addressesList: ', addressesList);

  await browser.storage.local.set({
    addressesList,
  });
};

export const setCurrentWallet = async (publicKey: string) => {
  const { addresses } = await getWalletInfoByPublicKey(publicKey);
  const { type, script, lock, lockHash } = addresses[0];
  const currentWallet = {
    publicKey,
    type,
    script,
    lock,
    lockHash,
  };

  await browser.storage.local.set({
    currentWallet,
  });
};

export const addWallet = async (privateKeyWithout0x, keystore, entropyKeystore, rootKeystore) => {
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKeyWithout0x}`);

  // wallets
  const wallets = await getWallets();
  const walletCommon = {
    publicKey,
    entropyKeystore,
    rootKeystore,
    keystore,
    keystoreType: KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE,
  };

  wallets.push(walletCommon);

  await browser.storage.local.set({
    wallets,
  });
};

// privateKey No '0x'
export async function addKeyperWallet(
  privateKey,
  password,
  entropyKeystore?: any,
  rootKeystore?: any,
) {
  const privateKeyWithout0x = privateKey.startsWith('0x') ? privateKey.substr(2) : privateKey;
  const keystore = await generateKeystore(privateKeyWithout0x, password);
  // has prefix '0x'
  const publicKey = ckbUtils.privateKeyToPublicKey(`0x${privateKeyWithout0x}`);

  containerManager.addPublicKeyForAllContainers(publicKey);

  await addWallet(privateKey, keystore, entropyKeystore, rootKeystore);

  await addPublicKey(publicKey);

  await updateAddressesList();

  await setCurrentWallet(publicKey);
}
