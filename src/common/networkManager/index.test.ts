import networkManager from './index';
import { networks } from './fixture';

describe('network manager', () => {
  it('should return initial networks', () => {
    const result = networkManager.getNetworkList();
    expect(result).toHaveLength(3);
  });

  it('should able to create a network', () => {
    const result = networkManager.createNetwork({
      name: 'my network',
      url: 'testtest.com',
    });
    expect(result).toBe(true);

    const networkList = networkManager.getNetworkList();
    expect(networkList).toHaveLength(4);
  });

  it('should able to get network info', () => {
    const result = networkManager.getNetwork('Testnet');
    expect(result).toBe(networks[1]);
  });

  it('should able to remove a network', () => {
    const tobeRemoved = networkManager.getNetwork('Testnet');
    const result = networkManager.removeNetwork('Testnet');
    expect(result[0]).toBe(tobeRemoved);
  });

  it('should able to set current network', () => {
    const result = networkManager.getCurrentNetwork();
    expect(result).toBe(networks[0]);

    networkManager.setCurrentNetwork(networks[1].name);
    expect(networkManager.getCurrentNetwork()).toBe(networks[1]);
  });
});
