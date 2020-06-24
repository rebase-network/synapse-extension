import createPopup from '@common/popup';

export default async (port, message) => {
  const popup = await createPopup();

  await popup.waitTabLoaded();

  browser.runtime.sendMessage(message);
};
