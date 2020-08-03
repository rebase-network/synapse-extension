export default class Singleton {
  private static instance: Singleton;

  private wallets = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private thisStorage = browser.storage.local;

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  async getAllPublicKeys() {
    const { publicKeys = [] } = await this.thisStorage.get('publicKeys');
    return publicKeys;
  }
}
