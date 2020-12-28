import { setCurrentWallet } from '@background/keyper/keyperwallet';
import ICurrentWalletManager from './ICurrentWalletManager';

export default class implements ICurrentWalletManager {
  // eslint-disable-next-line class-methods-use-this
  async setCurrentWallet(publicKey: string) {
    setCurrentWallet(publicKey);
  }
}
