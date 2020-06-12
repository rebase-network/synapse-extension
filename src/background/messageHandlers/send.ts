import { MESSAGE_TYPE } from '@utils/constants';

export default (port, message) => {
  if (message.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND) {
    chrome.windows.create(
      {
        url: 'notification.html',
        type: 'popup',
        width: 360,
        height: 590,
        top: 100,
        left: 100,
      },
      () => {
        // WORKAROUND: improve me
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: MESSAGE_TYPE.GOTO_SEND_PAGE,
            data: message.data,
          });
        }, 3000);
      },
    );
  }
};
