import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { Container } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';
import * as Keystore from '../wallet/passwordEncryptor';
import { sign as signWithSecp256k1 } from './sign';

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
  return wallet.keystore;
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

const containerFactory = {
  createContainer: () => {
    const container = new Container([
      {
        algorithm: SignatureAlgorithm.secp256k1,
        provider: {
          async sign(context, message) {
            const key = await getKeystoreFromWallets(context.publicKey);
            if (!key) {
              throw new Error(`no key for address: ${context.address}`);
            }
            const privateKeyBuffer = await Keystore.decrypt(key, context.password);
            const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
            const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

            const signature = signWithSecp256k1(privateKey, message);
            return signature;
          },
        },
      },
    ]);
    return container;
  },
};

export default containerFactory;
