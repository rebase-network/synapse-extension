import Popup from './popup';

const defaultOptions = {
  url: 'notification.html',
  type: 'popup' as 'popup',
  width: 360,
  height: 590,
};

const createPopup = async (options = {}) => {
  const finalParams = { ...defaultOptions, ...options };
  const popupWindow = await browser.windows.create(finalParams);
  await browser.storage.local.set({ lastWindowId: popupWindow.id });
  return new Popup(popupWindow);
};

export const getLastWindowId = async () => {
  const { lastWindowId } = await browser.storage.local.get('lastWindowId');
  return lastWindowId;
};

export default createPopup;
