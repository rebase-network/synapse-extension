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
  return new Popup(popupWindow);
};

export default createPopup;
