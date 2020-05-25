import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
  ReactDOM.render(<App />, document.getElementById('popup'));
});
