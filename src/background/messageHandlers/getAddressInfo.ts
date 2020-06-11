import * as browser from 'webextension-polyfill';
import { MESSAGE_TYPE } from '@utils/constants';

export default async (port) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
    requestId: 1,
    success: true,
    message: 'get address info successfully',
    data: currentWallet,
  });
};
