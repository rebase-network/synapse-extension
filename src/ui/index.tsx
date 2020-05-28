import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import zh from './pages/locales/zh'
import en from './pages/locales/en'

let messages = {}
messages['en'] = en;
messages['zh'] = zh;

import App from './App';

import { configService } from '../config';
import CKB from '@nervosnetwork/ckb-sdk-core';

declare global {
  interface Window {
    ckb: any;
  }
}

window.ckb = {
  rpc: new CKB(configService.CKB_RPC_ENDPOINT),
};

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(<IntlProvider locale={'zh'} messages={messages['zh']} ><App /> </IntlProvider>, document.getElementById('popup'));
});
