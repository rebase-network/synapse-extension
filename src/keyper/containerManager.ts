import { Container } from '@keyper/container';

export interface INetworkContainer {
  network: string;
  container: Container;
}

interface IContainer {
  [network: string]: Container;
}

export default class {
  containers: IContainer = {};

  addContainer(networkContainer: INetworkContainer) {
    this.containers[networkContainer.network] = networkContainer.container;
  }

  getContainer(network: string) {
    return this.containers[network];
  }
}
