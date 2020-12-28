import { MESSAGE_TYPE } from '@src/common/utils/constants';
import ICurrentWalletManager from './ICurrentWalletManager';

export default class {
  private storage;

  private messageManager;

  private currentWalletManager;

  constructor(messageManager, storage, currentWalletManager: ICurrentWalletManager) {
    this.storage = storage;
    this.messageManager = messageManager;
    this.currentWalletManager = currentWalletManager;
  }

  async init() {
    this.messageManager.addListener(async (request) => {
      if (request.type !== MESSAGE_TYPE.NETWORK_CHANGED) return;
      this.handleNetworkChange();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async handleNetworkChange() {
    const { currentWallet } = await this.storage.get('currentWallet');
    this.currentWalletManager.setCurrentWallet(currentWallet.publicKey);
  }
}
