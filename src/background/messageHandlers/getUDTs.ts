import { getUDTsByLockHash } from '@utils/apis';
import { aggregateUDT } from '@utils/token';
import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';

const getUDTs = async (typeScripts): Promise<any> => {
  const { currentWallet } = await browser.storage.local.get('currentWallet');
  if (!currentWallet) return {};
  const { lock: lockHash } = currentWallet;
  const { udts } = await getUDTsByLockHash({
    lockHash,
    typeScripts,
  });
  const udtsWithCapacity = aggregateUDT(udts);
  console.log('udts: ', udts);
  console.log('udtsWithCapacity: ', udtsWithCapacity);

  return udtsWithCapacity;
};

export default async (port, data) => {
  const udts = await getUDTs(data?.typeScripts);

  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_UDTS,
    requestId: 'getUDTs',
    success: true,
    message: 'get UDTs successfully',
    target: WEB_PAGE,
    data: udts,
  });
};
