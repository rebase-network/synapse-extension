import NetworkManager from './index';
import { networks } from './constants';

describe('network manager', () => {
  beforeEach(() => {
    NetworkManager.initNetworks();
  });

  afterEach(() => {
    browser.storage.local.clear();
  });

  it('should return initial networks', async () => {
    console.log('---------', networks);
    const result = await NetworkManager.getNetworkList();
    expect(result).toHaveLength(networks.length);
  });

  it('should able to set current network', async () => {
    const result = await NetworkManager.getCurrentNetwork();
    console.log('---------', networks);
    expect(result).toBe(networks[0]);
    await NetworkManager.setCurrentNetwork(networks[0].name);
    expect(await NetworkManager.getCurrentNetwork()).toBe(networks[0]);
  });

  it('should able to create a network', async () => {
    console.log('---------', networks);
    const result = await NetworkManager.createNetwork({
      name: 'my network',
      nodeURL: 'testtest.com',
      cacheURL: 'testtest.com',
    });

    expect(result).toHaveLength(networks.length);
  });

  it('should able to get network info', async () => {
    console.log('---------', networks);
    const result = await NetworkManager.getNetwork('Aggron Testnet');
    expect(result).toBe(networks[0]);
  });

  it('should able to remove a network', async () => {
    console.log('---------', networks);
    const result = await NetworkManager.removeNetwork('Aggron Testnet');
    expect(result).toHaveLength(networks.length);
  });
});
