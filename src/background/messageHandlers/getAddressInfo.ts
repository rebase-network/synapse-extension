import * as browser from 'webextension-polyfill';
import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';

export default async (port) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
    requestId: 1,
    success: true,
    message: 'get address info successfully',
    target: WEB_PAGE,
    data: currentWallet,
  });
};
