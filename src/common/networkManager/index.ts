import _ from 'lodash';
import { networks } from './constants';

interface INetwork {
  name: string;
  nodeURL: string;
  cacheURL: string;
}

let currentNetwork = networks[0];

const NetworkManager = {
  // constructor(networks) {
  //   this.networks = networks;
  // }
  createNetwork(network: INetwork) {
    networks.push(network);
    return NetworkManager.getNetworkList();
  },
  removeNetwork(name: string) {
    _.remove(networks, { name });
    return NetworkManager.getNetworkList();
  },
  getNetworkList() {
    return networks;
  },
  getNetwork(name: string) {
    return _.find(networks, { name });
  },
  getCurrentNetwork() {
    return currentNetwork;
  },
  setCurrentNetwork(name: string) {
    currentNetwork = NetworkManager.getNetwork(name);
  },
};

export default NetworkManager;
