import _ from 'lodash';
import { networks as presetNetworks } from '@utils/constants/networks';

interface INetwork {
  title: string;
  networkType: string;
  prefix: string;
  nodeURL: string;
  cacheURL: string;
}

const NetworkManager = {
  async initNetworks() {
    const isNetworkSet = await NetworkManager.isNetworkSet();
    if (isNetworkSet) return;

    await browser.storage.local.set({
      networks: presetNetworks,
      currentNetwork: presetNetworks[0],
    });
    await NetworkManager.setNetworkStatus(true);
  },
  async isNetworkSet(): Promise<boolean> {
    const { isNetworkSet } = await browser.storage.local.get('isNetworkSet');
    return isNetworkSet;
  },
  async setNetworkStatus(isSet: boolean) {
    await browser.storage.local.set({ isNetworkSet: isSet });
  },
  async reset() {
    await NetworkManager.setNetworkStatus(false);
    await NetworkManager.initNetworks();
  },
  async createNetwork(network: INetwork): Promise<INetwork[]> {
    const networks = await NetworkManager.getNetworkList();
    networks.push(network);
    await browser.storage.local.set({ networks });

    return NetworkManager.getNetworkList();
  },
  async removeNetwork(title: string): Promise<INetwork[]> {
    const networks = await NetworkManager.getNetworkList();
    _.remove(networks, { title });
    await browser.storage.local.set({ networks });
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    if (currentNetwork.title === title) {
      await NetworkManager.setCurrentNetwork(networks[0]?.title);
    }
    return NetworkManager.getNetworkList();
  },
  async getNetworkList(): Promise<INetwork[]> {
    const { networks = [] } = await browser.storage.local.get('networks');
    return networks;
  },
  async getNetwork(title: string): Promise<INetwork> {
    const networks = await NetworkManager.getNetworkList();
    return _.find(networks, { title });
  },
  async getCurrentNetwork(): Promise<INetwork> {
    const networks = await NetworkManager.getNetworkList();
    const { currentNetwork = networks[0] } = await browser.storage.local.get('currentNetwork');
    return currentNetwork;
  },
  async setCurrentNetwork(title: string) {
    if (!title) return;
    const network = await NetworkManager.getNetwork(title);
    await browser.storage.local.set({ currentNetwork: network });
  },
};

export default NetworkManager;
