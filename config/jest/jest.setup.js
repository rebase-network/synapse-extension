const windowCrypto = require('window-crypto');
const crypto = require('crypto');

require('jest-webextension-mock');

require('dotenv').config({
  path: './.env',
});

Object.assign(global.crypto, {
  ...windowCrypto,
  ...crypto,
  subtle: {
    encrypt: () => {
      console.error('ERROR: It is a fake function. encrypt is not implemented in jsdom');
    },
    decrypt: () => {
      console.error('ERROR: It is a fake function. decrypt is not implemented in jsdom');
    },
    importKey: () => {
      console.error('ERROR: It is a fake function. importKey is not implemented in jsdom');
    },
    deriveKey: () => {
      console.error('ERROR: It is a fake function. deriveKey is not implemented in jsdom');
    },
  },
});