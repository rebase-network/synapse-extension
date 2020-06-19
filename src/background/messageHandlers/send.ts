import { MESSAGE_TYPE } from '@utils/constants';
import createPopup from '@common/popup';

export default async (port, message) => {
  if (message.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND) {
    const popup = await createPopup();

    await popup.waitTabLoaded();

    browser.runtime.sendMessage({
      type: MESSAGE_TYPE.GOTO_SEND_PAGE,
      data: message.data,
    });
  }
};
