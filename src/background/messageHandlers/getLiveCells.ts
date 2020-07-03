import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';
import { getUnspentCells } from '@utils/apis';

export default async (port, data) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  const { lockHash = currentWallet.lock } = data;

  let cells = [];

  if (currentWallet) {
    cells = await getUnspentCells(lockHash, data);
  }

  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_LIVE_CELLS,
    requestId: 'getLiveCellsRequestId',
    success: true,
    message: currentWallet ? 'get live cells successfully' : 'do not have live cells',
    target: WEB_PAGE,
    data: cells,
  });
};
