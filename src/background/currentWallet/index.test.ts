import { CurrentWalletHandler, CurrentWalletManager } from '@background/currentWallet';
import { BrowserMessageManager } from '@common/messageManager';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

describe('currentWallet module', () => {
  const messageManager = new BrowserMessageManager();
  const currentWalletManager = new CurrentWalletManager();
  const currentWalletHandler = new CurrentWalletHandler(
    messageManager,
    browser.storage.local,
    currentWalletManager,
  );
  it('should add listener', () => {
    currentWalletHandler.init();
    expect(browser.runtime.onMessage.addListener).toHaveBeenCalled();
  });

  it('handle network change', () => {
    // currentWalletHandler.handleNetworkChange();
    browser.runtime.sendMessage({ type: MESSAGE_TYPE.NETWORK_CHANGED });
    expect(browser.storage.local.get).toHaveBeenCalled();
  });
});
