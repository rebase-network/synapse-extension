import { Secp256k1LockScript as Secp256k1LockScriptOriginal } from '@keyper/container/lib/locks/secp256k1';
import { SignatureAlgorithm } from '@keyper/specs';
import LOCKS_INFO, { NETWORKS } from '@utils/constants/locksInfo';
import ContainerManager from './containerManager';
import WalletManager from './walletManager';
import { Keccak256LockScript, AnypayLockScript, Secp256k1LockScript } from './locks';
import containerFactory from './containerFactory';
import signProvider from './signProviders/secp256k1';

export default async () => {
  const walletManager = WalletManager.getInstance();
  const containerManager = ContainerManager.getInstance();
  const publicKeys = await walletManager.getAllPublicKeys();

  // create keyper container for each network
  NETWORKS.forEach((name) => {
    containerManager.addContainer({
      name,
      container: containerFactory.createContainer(),
    });
  });
  const containers = containerManager.getAllContainers();

  // add lock script for all containers
  Object.keys(containers).forEach((name) => {
    const container = containers[name];
    // add lock script
    const original = new Secp256k1LockScriptOriginal();
    original.setProvider(signProvider);
    const secp256k1LockScript = new Secp256k1LockScript(
      LOCKS_INFO[name].secp256k1.codeHash,
      LOCKS_INFO[name].secp256k1.txHash,
      LOCKS_INFO[name].secp256k1.hashType,
      original,
    );

    const keccak256LockScript = new Keccak256LockScript(
      LOCKS_INFO[name].keccak256.codeHash,
      LOCKS_INFO[name].keccak256.txHash,
      LOCKS_INFO[name].keccak256.hashType,
    );

    const anypayLockScript = new AnypayLockScript(
      LOCKS_INFO[name].anypay.codeHash,
      LOCKS_INFO[name].anypay.txHash,
      LOCKS_INFO[name].anypay.hashType,
    );

    // secp256k1LockScript.setProvider(signProvider);
    keccak256LockScript.setProvider(signProvider);
    anypayLockScript.setProvider(signProvider);

    container.addLockScript(secp256k1LockScript);
    container.addLockScript(keccak256LockScript);
    container.addLockScript(anypayLockScript);
    publicKeys.forEach((publicKey) => {
      container.addPublicKey({
        payload: publicKey,
        algorithm: SignatureAlgorithm.secp256k1,
      });
    });
  });
};
