import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';
import { getUnspentCells } from '@utils/apis';

export default async (port) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  let cells = [];
  if (currentWallet) {
    cells = await getUnspentCells(currentWallet?.lock);
  }
  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_LIVE_CELLS,
    requestId: 'getAddressInfo',
    success: true,
    message: currentWallet ? 'get live cells successfully' : 'do not have live cells',
    target: WEB_PAGE,
    data: cells,
  });
};
