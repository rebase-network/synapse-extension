import { BACKGROUND_PORT, WEB_PAGE, CONTENT_SCRIPT } from '@utils/message/constants';
import _ from 'lodash';

function injectCustomJs(jsPath) {
  const jsPathToInject = jsPath || 'js/injectedScript.js';
  const temp = document.createElement('script');
  const container = document.head || document.documentElement;
  temp.setAttribute('type', 'text/javascript');
  // full url will be: chrome-extension://ggpbicboegkhkbnoifoljffhicfhgbjn/js/injectedScript.js
  temp.src = browser.extension.getURL(jsPathToInject);
  temp.onload = () => {
    temp.remove();
  };
  container.appendChild(temp);
}

try {
  injectCustomJs('js/injectedScript.js');
} catch (e) {
  console.error('Synapse injection failed.', e);
}

// Refer to chrome extension messaging: https://developer.chrome.com/extensions/messaging

// post and listen message(long live) from background
const port = browser.runtime.connect('', { name: 'knockknock' });
port.onMessage.addListener((message: any) => {
  const shouldHandleByMe = [WEB_PAGE, CONTENT_SCRIPT].indexOf(message.target) !== -1;
  const messageHandled = _.has(message, 'success');
  if (shouldHandleByMe && messageHandled) {
    // send to web page(injected script)
    window.postMessage({ ...message, target: WEB_PAGE }, '*');
  }
});

// post and listen message(one time) from background
// background can not send message with port, can only use one time message
browser.runtime.onMessage.addListener((message) => {
  const messageHandled = _.has(message, 'success');
  const sendToWebPage = message.target === WEB_PAGE;
  if (messageHandled && sendToWebPage) {
    window.postMessage(message, '*');
  }
});

// forward message from web page to background
window.addEventListener(
  'message',
  (e) => {
    const message = e.data;
    const isMessageValid = message.type;
    const sendToBG = message.target === BACKGROUND_PORT;
    if (isMessageValid && sendToBG) {
      port.postMessage(message);
    }
  },
  false,
);
