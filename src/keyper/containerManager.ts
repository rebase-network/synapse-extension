import { Container } from '@keyper/container';

export interface INetworkContainer {
  network: string;
  container: Container;
}

interface IContainer {
  [network: string]: Container;
}

export default class Singleton {
  private static instance: Singleton;

  private containers: IContainer = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  public addContainer(container: INetworkContainer) {
    this.containers[container.network] = container.container;
  }

  public getContainer(network: string) {
    return this.containers[network];
  }

  public getAllContainers() {
    return this.containers;
  }
}
