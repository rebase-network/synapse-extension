import _ from 'lodash';
import { networks as presetNetworks } from '@src/common/utils/constants/networks';

interface INetwork {
  title: string;
  networkType: string;
  prefix: string;
  nodeURL: string;
  cacheURL: string;
}

const deprecatedUrls = ['https://testnet.getsynapse.io/rpc', 'https://mainnet.getsynapse.io/rpc'];
const urlMap = {
  'https://testnet.getsynapse.io/rpc': 'https://ckb-testnet.rebase.network/rpc',
  'https://mainnet.getsynapse.io/rpc': 'https://ckb-mainnet.rebase.network/rpc',
};

const NetworkManager = {
  async initNetworks() {
    const isNetworkSet = await NetworkManager.isNetworkSet();
    const networks = await NetworkManager.getNetworkList();
    const needToUpdateUrls = networks.some(
      (network) => deprecatedUrls.indexOf(network.nodeURL) !== -1,
    );
    if (needToUpdateUrls) {
      const correctNetworks = networks.map((network) => {
        if (deprecatedUrls.indexOf(network.nodeURL) !== -1) {
          return {
            ...network,
            nodeURL: urlMap[network.nodeURL],
          };
        }
        return network;
      });
      await browser.storage.local.set({
        networks: correctNetworks,
      });
    }
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
