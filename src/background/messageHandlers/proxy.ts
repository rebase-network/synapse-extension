import { getLastWindowId } from '@common/popup';

export const sendToWebPage = (message) => {
  const sendToContentScript = async (tabs) => {
    // send back reponse to web page
    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0]?.id, message);
      const windowId = await getLastWindowId();
      browser.windows.remove(windowId);
    }
  };
  browser.tabs
    .query({ currentWindow: false, active: true })
    .then(sendToContentScript, console.error);
};

export default sendToWebPage;
