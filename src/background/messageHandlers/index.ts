import * as browser from 'webextension-polyfill';
import { MESSAGE_TYPE } from '@utils/constants';
import send from './send';
import getAddressInfoHandler from './getAddressInfo';

const handler = async (message, port) => {
  if (message.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND && !message.success) {
    send(port, message);
  }

  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO && !message.success) {
    // TODO: capacity
    getAddressInfoHandler(port);
  }
};

export default () => {
  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (message: any) => {
      handler(message, port);
    });
  });
};
