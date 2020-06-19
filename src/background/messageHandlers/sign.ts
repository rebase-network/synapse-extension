import { MESSAGE_TYPE } from '@utils/constants';
import createPopup from '@common/popup';

export default async (port, message) => {
  const popup = await createPopup();

  await popup.waitTabLoaded();

  browser.runtime.sendMessage({
    type: MESSAGE_TYPE.GOTO_SIGN_PAGE,
    data: message.data,
  });
};
