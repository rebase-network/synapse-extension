const windowCrypto = require('window-crypto');
const crypto = require('crypto');

require('jest-webextension-mock');

require('@testing-library/jest-dom/extend-expect');

require('dotenv').config({
  path: './.env',
});

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

Object.assign(global.crypto, {
  ...windowCrypto,
  ...crypto,
  subtle: {
    encrypt: () => {
      console.warn('ERROR: It is a fake function. encrypt is not implemented in jsdom');
    },
    decrypt: () => {
      console.warn('ERROR: It is a fake function. decrypt is not implemented in jsdom');
    },
    importKey: () => {
      console.warn('ERROR: It is a fake function. importKey is not implemented in jsdom');
    },
    deriveKey: () => {
      console.warn('ERROR: It is a fake function. deriveKey is not implemented in jsdom');
    },
  },
});