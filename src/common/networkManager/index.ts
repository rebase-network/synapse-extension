import _ from 'lodash';
import { networks } from './fixture';

interface INetwork {
  name: string;
  url: string;
}

let currentNetwork = networks[0];

const NetworkManager = {
  // constructor(networks) {
  //   this.networks = networks;
  // }
  createNetwork(network: INetwork) {
    networks.push(network);
    return true;
  },
  removeNetwork(name: string) {
    return _.remove(networks, { name });
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
