import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import zh from '@common/locales/zh';
import en from '@common/locales/en';
import App from '@ui/App';
import { getDefaultLanguage } from '@utils/locale';

const messages = {
  en,
  zh,
};

declare global {
  interface Window {
    ckb: any;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(
    <IntlProvider locale={getDefaultLanguage()} messages={messages[getDefaultLanguage()]}>
      <App />
    </IntlProvider>,
    document.getElementById('popup'),
  );
});
