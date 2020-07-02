import _ from 'lodash';
import { MESSAGE_TYPE } from '@utils/constants';
import sendToPopup from './sendToPopup';
import getAddressInfo from './getAddressInfo';
import getLiveCells from './getLiveCells';

const handler = async (message, port) => {
  const isSendToPopup =
    [
      MESSAGE_TYPE.EXTERNAL_SIGN,
      MESSAGE_TYPE.EXTERNAL_SEND,
      MESSAGE_TYPE.EXTERNAL_SIGN_SEND,
    ].indexOf(message.type) !== -1;

  if (isSendToPopup) {
    sendToPopup(port, message);
  }

  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO) {
    getAddressInfo(port);
  }

  if (message.type === MESSAGE_TYPE.EXTERNAL_GET_LIVE_CELLS) {
    getLiveCells(port, message.data);
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
