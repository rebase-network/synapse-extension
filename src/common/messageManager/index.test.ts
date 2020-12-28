import { BrowserMessageManager } from '@common/messageManager';

describe('message manager', () => {
  it('should add listener', () => {
    const manager = new BrowserMessageManager();
    const listener = jest.fn();
    manager.addListener(listener);
    expect(browser.runtime.onMessage.addListener).toHaveBeenCalledWith(listener);
  });
  it('should remove listener', () => {
    const manager = new BrowserMessageManager();
    const listener = jest.fn();
    manager.removeListener(listener);
    expect(browser.runtime.onMessage.removeListener).toHaveBeenCalledWith(listener);
  });
});
