import { Secp256k1LockScript as Secp256k1LockScriptOriginal } from '@keyper/container/lib/locks/secp256k1';
import ContainerManager from './containerManager';
import { Keccak256LockScript, AnypayLockScript, Secp256k1LockScript } from './locks';
import LOCKS_INFO, { NETWORKS } from './locksInfo';
import containerFactory from './containerFactory';

export default () => {
  const manager = ContainerManager.getInstance();
  NETWORKS.forEach((name) => {
    manager.addContainer({
      name,
      container: containerFactory.createContainer(),
    });
  });
  const containers = manager.getAllContainers();
  // add lock script for all containers
  Object.keys(containers).forEach((name) => {
    const container = containers[name];
    // add lock script
    container.addLockScript(
      new Secp256k1LockScript(
        LOCKS_INFO[name].secp256k1.codeHash,
        LOCKS_INFO[name].secp256k1.txHash,
        LOCKS_INFO[name].secp256k1.hashType,
        new Secp256k1LockScriptOriginal(),
      ),
    );
    container.addLockScript(
      new Keccak256LockScript(
        LOCKS_INFO[name].keccak256.codeHash,
        LOCKS_INFO[name].keccak256.txHash,
        LOCKS_INFO[name].keccak256.hashType,
      ),
    );
    container.addLockScript(
      new AnypayLockScript(
        LOCKS_INFO[name].anypay.codeHash,
        LOCKS_INFO[name].anypay.txHash,
        LOCKS_INFO[name].anypay.hashType,
      ),
    );
  });
};
