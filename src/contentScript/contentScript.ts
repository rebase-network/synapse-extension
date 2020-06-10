import { MESSAGE_TYPE } from '../utils/constants';

function injectCustomJs(jsPath) {
  const jsPathToInject = jsPath || 'js/injectedScript.js';
  const temp = document.createElement('script');
  const container = document.head || document.documentElement;
  temp.setAttribute('type', 'text/javascript');
  // 获得的地址类似：chrome-extension://ggpbicboegkhkbnoifoljffhicfhgbjn/js/injectedScript.js
  temp.src = chrome.extension.getURL(jsPathToInject);
  temp.onload = () => {
    // 放在页面不好看，执行完后移除掉
    temp.remove();
  };
  container.appendChild(temp);
}

injectCustomJs('js/injectedScript.js');

window.addEventListener(
  'message',
  (e) => {
    if (e.data.messageType === MESSAGE_TYPE.EXTERNAL_SEND) {
      chrome.runtime.sendMessage(
        {
          messageType: MESSAGE_TYPE.EXTERNAL_SEND,
          payload: e.data.payload,
        },
        (response) => {
          console.log(`from bg${response}`);
        },
      );
    }
  },
  false,
);
