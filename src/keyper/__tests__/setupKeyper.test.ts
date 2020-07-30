import setupKeyper from '../setupKeyper';
import ContainerManager from '../containerManager';

describe('setup keyper', () => {
  const networks = ['testnet', 'mainnet'];
  it('should be able to setup keyper for mainnet and testnet', () => {
    setupKeyper();
    const manager = ContainerManager.getInstance();
    const containers = manager.getAllContainers();
    const containerNetworks = Object.keys(containers);
    expect(containerNetworks).toEqual(networks);
    containerNetworks.forEach((network) => {
      expect(containers[network].lockScriptSize()).toEqual(3);
    });
  });
});
