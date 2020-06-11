import * as browser from 'webextension-polyfill';
import { MESSAGE_TYPE } from '@utils/constants';
import send from './send';
import getLocks from './getLocks';
import getAddressInfoHandler from './getAddressInfo';

const handler = async (message, port) => {
  if (message.type === MESSAGE_TYPE.EXTERNAL_SEND) {
    send(port, message);
  }
  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_LOCKS) {
    getLocks(port);
  }
  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO) {
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
