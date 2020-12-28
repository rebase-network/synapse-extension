import { MESSAGE_TYPE } from '@src/common/utils/constants';
import init from '../init';

describe('address list message handler', () => {
  it('should return address list', () => {
    init();
    expect(browser.runtime.onMessage.addListener).toBeCalled();
  });

  it('should handle message', () => {
    browser.runtime.sendMessage({
      type: MESSAGE_TYPE.REQUEST_ADDRESS_LIST,
    });
    expect(browser.runtime.sendMessage).toBeCalled();
  });

  it('should handle message', () => {
    browser.runtime.sendMessage({
      type: 'address list message handler unknown type',
    });
    expect(browser.runtime.sendMessage).not.toBeCalledWith({ type: MESSAGE_TYPE.ADDRESS_LIST });
  });
});
