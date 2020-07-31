import setupKeyper from '../setupKeyper';
import ContainerManager from '../containerManager';
import { NETWORKS } from '../locksInfo';

describe('setup keyper', () => {
  it('should be able to setup keyper for mainnet and testnet', () => {
    setupKeyper();

    const manager = ContainerManager.getInstance();
    const containers = manager.getAllContainers();
    const containerNames = manager.names;

    expect(containerNames).toEqual(NETWORKS);

    containerNames.forEach((network) => {
      expect(containers[network].lockScriptSize()).toEqual(3);
    });
  });
});
