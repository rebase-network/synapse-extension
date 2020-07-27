export const MESSAGE_TYPE = {
  IMPORT_MNEMONIC: 'IMPORT_MNEMONIC',
  GEN_MNEMONIC: 'GEN_MNEMONIC',
  RECE_MNEMONIC: 'RECE_MNEMONIC',
  SAVE_MNEMONIC: 'SAVE_MNEMONIC',
  REQUEST_ADDRESS_INFO: 'REQUEST_ADDRESS_INFO',
  ADDRESS_INFO: 'ADDRESS_INFO',
  REQUEST_BALANCE_BY_ADDRESS: 'REQUEST_BALANCE_BY_ADDRESS',
  BALANCE_BY_ADDRESS: 'BALANCE_BY_ADDRESS',
  REQUEST_SEND_TX: 'REQUEST_SEND_TX',
  SEND_TX_OVER: 'SEND_TX_OVER',
  IS_INVALID_MNEMONIC: 'IS_INVALID_MNEMONIC',
  VALIDATE_PASS: 'VALIDATE_PASS',
  SIGN_TX: 'SIGN_TX',
  SEND_TX_ERROR: 'SEND_TX_ERROR',

  // tx-detail
  REQUEST_TX_DETAIL: 'REQUEST_TX_DETAIL',
  TX_DETAIL: 'TX_DETAIL',

  // import-private-key
  IMPORT_PRIVATE_KEY: 'IMPORT_PRIVATE_KEY',
  IMPORT_PRIVATE_KEY_ERR: 'IMPORT_PRIVATE_KEY_ERR',
  IMPORT_PRIVATE_KEY_OK: 'IMPORT_PRIVATE_KEY_OK',

  // import-keystore
  IMPORT_KEYSTORE: 'IMPORT_KEYSTORE',
  IMPORT_KEYSTORE_OK: 'IMPORT_KEYSTORE_OK',
  IMPORT_KEYSTORE_ERR: 'IMPORT_KEYSTORE_ERR',

  // export-private-key
  EXPORT_PRIVATE_KEY_CHECK: 'EXPORT_PRIVATE_KEY_CHECK',
  EXPORT_PRIVATE_KEY_CHECK_RESULT: 'EXPORT_PRIVATE_KEY_CHECK_RESULT',
  EXPORT_PRIVATE_KEY_SECOND: 'EXPORT_PRIVATE_KEY_SECOND',
  EXPORT_PRIVATE_KEY_SECOND_RESULT: 'EXPORT_PRIVATE_KEY_SECOND_RESULT',

  // my addresses
  TO_MY_ADDRESSES: 'TO_MY_ADDRESSES',
  REQUEST_MY_ADDRESSES: 'REQUEST_MY_ADDRESSES',
  RESULT_MY_ADDRESSES: 'RESULT_MY_ADDRESSES',
  SELECTED_MY_ADDRESSES: 'SELECTED_MY_ADDRESSES',
  RETURN_SELECTED_MY_ADDRESSES: 'RETURN_SELECTED_MY_ADDRESSES',

  // export mneonic
  EXPORT_MNEONIC_CHECK: 'EXPORT_MNEONIC_CHECK',
  EXPORT_MNEONIC_CHECK_RESULT: 'EXPORT_MNEONIC_CHECK_RESULT',
  EXPORT_MNEONIC_SECOND: 'EXPORT_MNEONIC_SECOND',
  EXPORT_MNEONIC_SECOND_RESULT: 'EXPORT_MNEONIC_SECOND_RESULT',

  // ON_KEYPER
  ON_KEYPER: 'ON_KEYPER',

  GET_TX_HISTORY: 'GET_TX_HISTORY',
  SEND_TX_HISTORY: 'SEND_TX_HISTORY',

  GOTO_SEND_PAGE: 'GOTO_SEND_PAGE',
  GOTO_SIGN_PAGE: 'GOTO_SIGN_PAGE',

  // message from dapp
  EXTERNAL_AUTH: 'auth',
  EXTERNAL_GET_ADDRESS_INFO: 'address_info',
  EXTERNAL_GET_LOCKS: 'locks',
  EXTERNAL_SIGN: 'sign',
  EXTERNAL_SEND: 'send',
  EXTERNAL_SIGN_SEND: 'sign_send',
  EXTERNAL_GET_LIVE_CELLS: 'live_cells',

  // delete wallet
  DELETE_WALLET: 'DELETE_WALLET',
  DELETE_WALLET_ERR: 'DELETE_WALLET_ERR',
  DELETE_WALLET_OK: 'DELETE_WALLET_OK',
};

export const Ckb = {
  MainNetCodeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  TestNetCodeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
};

export const KEYSTORE_TYPE = {
  MNEMONIC_TO_KEYSTORE: '1',
  KEYSTORE_TO_KEYSTORE: '2',
  PRIVATEKEY_TO_KEYSTORE: '3',
};

export const TESTNET_EXPLORER_URL = 'https://explorer.nervos.org/aggron';
export const MAINNET_EXPLORER_URL = 'https://explorer.nervos.org';

export const MIN_CELL_CAPACITY = 61;

export const ADDRESS_TYPE_CODEHASH = {
  Secp256k1: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  AnyPay: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
  Keccak256: '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08',
};

export const enum LockType {
  Secp256k1 = 'Secp256k1',
  AnyPay = 'AnyPay',
  Keccak256 = 'Keccak256',
}

export const EMPTY_TX_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const EMPTY_DATA_HASH = EMPTY_TX_HASH;
export const CKB_TOKEN_DECIMALS = 10 ** 8;
