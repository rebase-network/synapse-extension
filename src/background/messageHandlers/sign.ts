import { MESSAGE_TYPE } from '@utils/constants';
import * as browser from 'webextension-polyfill';
import * as _ from 'lodash';

const notifyExtension = (msg) => {
  chrome.runtime.sendMessage(msg);
};

export default async (port, message) => {
  if (message.type !== MESSAGE_TYPE.EXTERNAL_SIGN) return;

  let notifWindow = await browser.tabs.query({ windowType: 'popup' });

  await browser.notifications.create({
    type: 'basic',
    iconUrl: 'logo-32.png',
    title: 'Tabs reloaded',
    message: 'Your tabs have been reloaded',
  });

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
    const intervalId = setInterval(async () => {
      const tabs = await browser.tabs.query({ windowId: notifWindow.id });
      // status: [loading, complete]
      if (tabs?.[0]?.status === 'complete') {
        clearInterval(intervalId);
        browser.runtime.sendMessage({
          type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
          data: message.data,
        });
      }
    }, 2000);
  } catch (error) {
    console.log('query tabs error: ', error);
  }

  // chrome.windows.create(
  //   {
  //     url: 'notification.html',
  //     type: 'popup',
  //     width: 360,
  //     height: 590,
  //     top: 100,
  //     left: 100,
  //   },
  //   () => {
  //     // WORKAROUND: improve me
  //     setTimeout(() => {
  //       chrome.runtime.sendMessage({
  //         type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
  //         data: message.data,
  //       });
  //     }, 3000);
  //   },
  // );
};
