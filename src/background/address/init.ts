import { getAddressList } from '@background/keyper/keyperwallet';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

export default () => {
  browser.runtime.onMessage.addListener(async (request) => {
    if (request.type !== MESSAGE_TYPE.REQUEST_ADDRESS_LIST) return;
    const addressList = await getAddressList();
    browser.runtime.sendMessage({
      data: addressList,
      type: MESSAGE_TYPE.ADDRESS_LIST,
    });
  });
};
