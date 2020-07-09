import _ from 'lodash';
import { networks as presetNetworks } from './constants';

interface INetwork {
  name: string;
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
    await browser.storage.local.set({ isNetworkSet: true });
  },
  async isNetworkSet() {
    const { isNetworkSet } = await browser.storage.local.get('isNetworkSet');
    return isNetworkSet;
  },
  async createNetwork(network: INetwork) {
    const networks = await NetworkManager.getNetworkList();
    networks.push(network);
    await browser.storage.local.set({ networks });

    return NetworkManager.getNetworkList();
  },
  async removeNetwork(name: string) {
    const networks = await NetworkManager.getNetworkList();
    _.remove(networks, { name });
    await browser.storage.local.set({ networks });
    const currentNetork = await NetworkManager.getCurrentNetwork();
    if (currentNetork.name === name) {
      await NetworkManager.setCurrentNetwork(networks[0]?.name);
    }
    return NetworkManager.getNetworkList();
  },
  async getNetworkList() {
    const { networks = [] } = await browser.storage.local.get('networks');
    return networks;
  },
  async getNetwork(name: string) {
    const networks = await NetworkManager.getNetworkList();
    return _.find(networks, { name });
  },
  async getCurrentNetwork() {
    const networks = await NetworkManager.getNetworkList();
    const { currentNetwork = networks[0] } = await browser.storage.local.get('currentNetwork');
    return currentNetwork;
  },
  async setCurrentNetwork(name: string) {
    if (!name) return;
    const network = await NetworkManager.getNetwork(name);
    await browser.storage.local.set({ currentNetwork: network });
  },
};

export default NetworkManager;
