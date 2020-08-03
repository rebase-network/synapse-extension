import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import * as Keystore from '@src/wallet/passwordEncryptor';
import { sign as secp256k1WithPrivateKey } from './secp256k1WithPrivateKey';

export async function getWalletsInStorage() {
  const walletsObj = await browser.storage.local.get('wallets');

  if (Array.isArray(walletsObj.wallets)) {
    return walletsObj.wallets;
  }
  return [];
}

// eslint-disable-next-line no-shadow
function findKeystoreInWallets(wallets, publicKey) {
  function findKeystore(wallet) {
    return wallet.publicKey === publicKey;
  }
  const wallet = wallets.find(findKeystore);
  return wallet?.keystore;
}

async function getKeystoreFromWallets(publicKey) {
  let nPublicKey = publicKey;
  if (!publicKey.startsWith('0x')) {
    nPublicKey = `0x${publicKey}`;
  }
  const wallets = await getWalletsInStorage();
  const ks = findKeystoreInWallets(wallets, nPublicKey);
  // keys[nPublicKey]
  return ks;
}

const getPrivateKey = async (context) => {
  if (context?.privateKey) return context.privateKey;

  const key = await getKeystoreFromWallets(context?.publicKey);
  if (!key) {
    throw new Error(`no key for address: ${context?.address}`);
  }
  const privateKeyBuffer = await Keystore.decrypt(key, context?.password);
  const Uint8ArrayPk = new Uint8Array(privateKeyBuffer?.data);
  const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);
  return privateKey;
};

const sign = async (context, message) => {
  const privateKey = await getPrivateKey(context);
  const signature = secp256k1WithPrivateKey(privateKey, message);
  return signature;
};

export default {
  sign,
};
