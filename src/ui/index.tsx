import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import App from './App';
import { configService } from '../config';
import { getDefaultLanguage } from '../utils/locale';
import CKB from '@nervosnetwork/ckb-sdk-core';

import zh from './pages/locales/zh';
import en from './pages/locales/en';

const messages = {
  en,
  zh,
};

declare global {
  interface Window {
    ckb: any;
  }
}

window.ckb = {
  rpc: new CKB(configService.CKB_RPC_ENDPOINT),
};

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(
    <IntlProvider locale={getDefaultLanguage()} messages={messages[getDefaultLanguage()]}>
      <App />
    </IntlProvider>,
    document.getElementById('popup'),
  );
});
