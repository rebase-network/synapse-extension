import * as browser from 'webextension-polyfill';
import { BACKGROUND_PORT, WEB_PAGE } from '@utils/message/constants';

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

injectCustomJs('js/injectedScript.js');

// listen message from background
const port = browser.runtime.connect({ name: 'knockknock' });
port.onMessage.addListener((message: any) => {
  if (message.type && message.success) {
    // send to web page(injected script)
    window.postMessage({ ...message, port: WEB_PAGE }, '*');
  } else if (message.type === 'Madame who?') {
    port.postMessage(message);
  }
});

window.addEventListener(
  'message',
  (e) => {
    const message = e.data;
    const isMessageValid = message.type && message.port === BACKGROUND_PORT;
    if (isMessageValid) {
      port.postMessage(message);
    }
  },
  false,
);
