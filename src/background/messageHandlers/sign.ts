import { MESSAGE_TYPE } from '@utils/constants';
import * as browser from 'webextension-polyfill';
import * as _ from 'lodash';

const notifyExtension = (msg) => {
  chrome.runtime.sendMessage(msg);
};

export default async (port, message) => {
  if (message.type !== MESSAGE_TYPE.EXTERNAL_SIGN) return;

  let notifWindow = await browser.tabs.query({ windowType: 'popup' });

  console.log('Before notifications 111111111111 ');
  await browser.notifications.create({
    type: 'basic',
    iconUrl: 'logo-32.png',
    title: 'Tabs reloaded',
    message: 'Your tabs have been reloaded',
  });
  console.log('After notifications 222222222222222 ');

  console.log('Before windows.create 333333333333 ');

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

  console.log('After windows.create 4444444444: ', notifWindow);

  try {
    const intervalId = setInterval(async () => {
      console.log('setInterval, notifWindow: ', notifWindow);
      const tabs = await browser.tabs.query({ windowId: notifWindow.id });
      console.log(tabs);
      // status: [loading, complete]
      if (tabs?.[0]?.status === 'complete') {
        console.log(' get tabs complete, will clear aaaaaaaaa ');

        clearInterval(intervalId);
        browser.runtime.sendMessage({
          type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
          data: message.data,
        });
        console.log('After sendMessage 55555555555555 ');
      }
    }, 2000);
  } catch (error) {
    console.log('query tabs error: ', error);
  }
  console.log('Sign method end 6666666666 ');

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
