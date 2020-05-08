// import i18n from 'locales/i18n'

export class UnsupportedCipher extends Error {
  constructor() {
    super('messages.unsupported-cipher');
  }
}

export class InvalidMnemonic extends Error {
  constructor() {
    super('messages.invalid-mnemonic');
  }
}

export class IncorrectPassword extends Error {
  public code = 103;
  constructor() {
    super('messages.incorrect-password');
  }
}

export class InvalidKeystore extends Error {
  constructor() {
    super('messages.invalid-keystore');
  }
}

export default {
  UnsupportedCipher,
  InvalidMnemonic,
  IncorrectPassword,
  InvalidKeystore,
};
