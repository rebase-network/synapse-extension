import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';
import { getAddressInfo } from '@utils/apis';
import { scriptToAddress } from '@keyper/specs/lib/address';
import NetworkManager from '@common/networkManager';

export default async (port) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  let capacity = '0';
  if (currentWallet) {
    const addressInfo = await getAddressInfo(currentWallet?.lock);
    capacity = addressInfo.capacity;
  }
  const currentNetwork = await NetworkManager.getCurrentNetwork();
  const address = scriptToAddress(currentWallet.script, {
    networkPrefix: currentNetwork.prefix,
    short: true,
  });
  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_GET_ADDRESS_INFO,
    requestId: 'getAddressInfo',
    success: true,
    message: currentWallet ? 'get address info successfully' : 'do not have wallet info',
    target: WEB_PAGE,
    data: currentWallet ? { ...currentWallet, capacity, address } : undefined,
  });
};
