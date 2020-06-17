import * as browser from 'webextension-polyfill';

export const sendToWebPage = (message) => {
  function sendToContentScript(tabs) {
    // send back reponse to web page
    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0]?.id, message);
    }
  }
  browser.tabs
    .query({ currentWindow: false, active: true })
    .then(sendToContentScript, console.error);
};

export default sendToWebPage;
