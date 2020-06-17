import { MESSAGE_TYPE } from '@utils/constants';
import * as browser from 'webextension-polyfill';
import * as _ from 'lodash';

const notifyExtension = (msg) => {
  chrome.runtime.sendMessage(msg);
};

export default async (port, message) => {
  if (message.type !== MESSAGE_TYPE.EXTERNAL_SIGN) return;

  let notifWindow = await browser.tabs.query({ windowType: 'popup' });

  if (_.isEmpty(notifWindow)) {
    notifWindow = await browser.windows.create({
      url: 'notification.html',
      type: 'popup',
      width: 360,
      height: 590,
      top: 100,
      left: 100,
    });
  }

  const msg = {
    type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
    data: message.data,
  };
  notifyExtension(msg);

  try {
    let QUERY_LIMIT = 5;
    const intervalId = setInterval(async () => {
      QUERY_LIMIT -= 1;
      const tabs = await browser.tabs.query({ windowId: notifWindow.id });
      // status: [loading, complete]
      if (tabs?.[0]?.status === 'complete' || QUERY_LIMIT === 0) {
        clearInterval(intervalId);
        browser.runtime.sendMessage({
          type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
          data: message.data,
        });
      }
    }, 2000);
  } catch (error) {
    console.error('query tabs error: ', error);
  }
};
