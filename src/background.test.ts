import * as chrome from 'sinon-chrome';

describe(' mock chrome sendMessage', () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.flush();
  });

  afterEach(() => {
    chrome.flush();
  });

  it('should send msg 123', () => {
    const mockSendMsg = jest.fn(chrome.runtime.sendMessage);
    mockSendMsg(123);
    expect(mockSendMsg).toHaveBeenCalledWith(123);
  });
});
