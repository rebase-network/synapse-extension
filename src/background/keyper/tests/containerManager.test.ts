import { Container } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';
import NetworkManager from '@common/networkManager';
import { aliceAddresses, bobAddresses } from '@src/test/fixture/address';
import ContainerManager from '../containerManager';
import TestLockScript from './fixtures/lockScript';

describe('keyper container manager', () => {
  const container = new Container([
    {
      algorithm: SignatureAlgorithm.secp256k1,
      provider: {
        async sign(context, message) {
          console.log('sign method: ', context, message);
          return 'txhash for testing';
        },
      },
    },
  ]);
  const manager = ContainerManager.getInstance();
  const alicePublicKey = aliceAddresses.publicKey;
  const bobPublicKey = bobAddresses.publicKey;
  const mainnetCodeHash = '0x0000000000000000000000000000000000000000000000000000000000000001';
  const testnetCodeHash = '0x0000000000000000000000000000000000000000000000000000000000000002';
  const lockScriptMainnet = new TestLockScript('mainnet', mainnetCodeHash);
  const lockScriptTestnet = new TestLockScript('testnet', testnetCodeHash);

  it('should able to add a container', () => {
    manager.addContainer({ name: 'mainnet', container });
    manager.addContainer({ name: 'testnet', container });
    const mainnetContainer = manager.getContainer('mainnet');
    const testnetContainer = manager.getContainer('testnet');
    expect(mainnetContainer).toEqual(container);
    expect(testnetContainer).toEqual(container);
  });

  it('should able to get current container', async () => {
    await NetworkManager.initNetworks();
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    expect(currentNetwork.networkType).toBe('mainnet');
    const mainnetContainer = manager.getContainer('mainnet');

    const currentContainer = await manager.getCurrentContainer();
    expect(currentContainer).toEqual(mainnetContainer);
  });

  it('should able to add public key for all containers', async () => {
    const mainnetContainer = manager.getContainer('mainnet');
    const testnetContainer = manager.getContainer('testnet');

    expect(mainnetContainer.publicKeySize()).toEqual(0);
    expect(testnetContainer.publicKeySize()).toEqual(0);
    manager.addPublicKeyForAllContainers(alicePublicKey);
    manager.addPublicKeyForAllContainers(bobPublicKey);
    expect(mainnetContainer.publicKeySize()).toEqual(2);
    expect(testnetContainer.publicKeySize()).toEqual(2);
  });

  it('should able to add lock script for all containers', async () => {
    const mainnetContainer = manager.getContainer('mainnet');
    const testnetContainer = manager.getContainer('testnet');

    expect(mainnetContainer.lockScriptSize()).toEqual(0);
    expect(testnetContainer.lockScriptSize()).toEqual(0);
    manager.addLockScriptForAllContainers(lockScriptMainnet);
    manager.addLockScriptForAllContainers(lockScriptTestnet);
    expect(mainnetContainer.lockScriptSize()).toEqual(2);
    expect(testnetContainer.lockScriptSize()).toEqual(2);
  });
});
