import { Container } from '@keyper/container';
import { SignatureAlgorithm, LockScript } from '@keyper/specs';
import NetworkManager from '@common/networkManager';

export interface INetworkContainer {
  name: string;
  container: Container;
}

interface IContainer {
  [name: string]: Container;
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
    this.containers[container.name] = container.container;
  }

  public getContainer(name: string): Container {
    return this.containers[name];
  }

  public async getCurrentContainer(): Promise<Container> {
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    return this.getContainer(currentNetwork.networkType);
  }

  public getAllContainers(): IContainer {
    return this.containers;
  }

  public get names(): string[] {
    return Object.keys(this.containers);
  }

  public addPublicKeyForAllContainers(publicKey: string) {
    this.names.forEach((name: string) => {
      this.containers[name].addPublicKey({
        payload: publicKey,
        algorithm: SignatureAlgorithm.secp256k1,
      });
    });
  }

  public addLockScriptForAllContainers(lockScript: LockScript) {
    this.names.forEach((name: string) => {
      this.containers[name].addLockScript(lockScript);
    });
  }
}
