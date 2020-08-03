import { networks } from '@utils/constants/networks';
import NetworkManager from './index';

describe('network manager', () => {
  beforeEach(async () => {
    await NetworkManager.initNetworks();
  });
  afterEach(async () => {
    await NetworkManager.reset();
  });

  it('should return initial networks', async () => {
    const result = await NetworkManager.getNetworkList();
    expect(result).toHaveLength(networks.length);
  });

  it('should able to set current network', async () => {
    const result = await NetworkManager.getCurrentNetwork();

    expect(result).toBe(networks[0]);

    await NetworkManager.setCurrentNetwork(networks[0].title);
    expect(await NetworkManager.getCurrentNetwork()).toBe(networks[0]);

    await NetworkManager.setCurrentNetwork(networks[1].title);
    expect(await NetworkManager.getCurrentNetwork()).toBe(networks[1]);
  });

  it('should able to create a network', async () => {
    const result = await NetworkManager.createNetwork({
      title: 'Lina Mainnet 2',
      networkType: 'mainnet',
      prefix: 'ckb',
      nodeURL: 'http://mainnet.getsynapse.io/rpc',
      cacheURL: 'http://mainnet.getsynapse.io/api',
    });

    expect(result).toHaveLength(networks.length);
  });

  it('should able to get network info', async () => {
    const result = await NetworkManager.getNetwork('Lina Mainnet');
    expect(result).toBe(networks[0]);
  });

  it('should able to remove a network', async () => {
    const result = await NetworkManager.removeNetwork('Lina Mainnet');
    expect(result).toHaveLength(networks.length);
  });
});
