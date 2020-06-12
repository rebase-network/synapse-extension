import * as browser from 'webextension-polyfill';
import * as _ from 'lodash';
import { MESSAGE_TYPE } from '@utils/constants';
import send from './send';
import getAddressInfoHandler from './getAddressInfo';

const handler = async (message, port) => {
  if (message.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND) {
    send(port, message);
  }

  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO) {
    // TODO: capacity
    getAddressInfoHandler(port);
  }
};

export default () => {
  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (message: any) => {
      const messageHandled = _.has(message, 'success');
      if (messageHandled) return;
      handler(message, port);
    });
  });
};
