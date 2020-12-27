import { getAddressList } from '@background/keyper/keyperwallet';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

export default () => {
  browser.runtime.onMessage.addListener(async () => {
    const addressList = await getAddressList();
    console.log('addressList: ', addressList);
    browser.runtime.sendMessage({
      data: addressList,
      type: MESSAGE_TYPE.ADDRESS_LIST,
    });
  });
};
