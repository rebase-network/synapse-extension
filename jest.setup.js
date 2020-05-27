const windowCrypto = require("window-crypto");
const crypto = require('crypto');

Object.assign(global.crypto, {
  ...windowCrypto,
  ...crypto,
  subtle: {
    encrypt: function () {
      console.error('ERROR: It is a fake function. encrypt is not implemented in jsdom')
    },
    decrypt: function () {
      console.error('ERROR: It is a fake function. decrypt is not implemented in jsdom')
    },
    importKey: function () {
      console.error('ERROR: It is a fake function. importKey is not implemented in jsdom')
    },
    deriveKey: function () {
      console.error('ERROR: It is a fake function. deriveKey is not implemented in jsdom')
    },
  }
})