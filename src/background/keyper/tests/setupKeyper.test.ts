import wallets from '@src/background/wallet/fixtures/wallets';
import { NETWORKS } from '@src/common/utils/constants/locksInfo';
import setupKeyper from '../setupKeyper';
import ContainerManager from '../containerManager';

describe('setup keyper', () => {
  const publicKeys = wallets.map((wallet) => wallet.publicKey);
  it('should be able to setup keyper for mainnet and testnet', async () => {
    await browser.storage.local.set({
      publicKeys,
    });

    await setupKeyper();

    const manager = ContainerManager.getInstance();
    const containers = manager.getAllContainers();
    const containerNames = manager.names;

    expect(containerNames).toEqual(NETWORKS);

    containerNames.forEach((network) => {
      expect(containers[network].lockScriptSize()).toEqual(3);
      expect(containers[network].publicKeySize()).toEqual(3);
    });
  });
});
