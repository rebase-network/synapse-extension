export const MESSAGE_TYPE = {
  IMPORT_MNEMONIC: 'IMPORT_MNEMONIC',
  GEN_MNEMONIC: 'GEN_MNEMONIC',
  RECE_MNEMONIC: 'RECE_MNEMONIC',
  SAVE_MNEMONIC: 'SAVE_MNEMONIC',
  REQUEST_ADDRESS_INFO: 'REQUEST_ADDRESS_INFO',
  ADDRESS_INFO: 'ADDRESS_INFO',
  REQUEST_BALANCE_BY_ADDRESS: 'REQUEST_BALANCE_BY_ADDRESS',
  BALANCE_BY_ADDRESS: 'BALANCE_BY_ADDRESS',
  RESQUEST_SEND_TX: 'RESQUEST_SEND_TX',
  SEND_TX_OVER: 'SEND_TX_OVER',
  IS_NOT_VALIDATE_MNEMONIC: 'IS_NOT_VALIDATE_MNEMONIC',
  VALIDATE_PASS: 'VALIDATE_PASS',

  // 跳转到tx-detail
  TO_TX_DETAIL: 'TO_TX_DETAIL',
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
};

export const Ckb = {
  MainNetCodeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  TestNetCodeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  rpcUrl: 'http://127.0.0.1:8114',
  remoteRpcUrl: 'http://106.13.40.34:8114/',
};

export const KEYSTORE_TYPE = {
  MNEMONIC_TO_KEYSTORE: '1',
  KEYSTORE_TO_KEYSTORE: '2',
  PRIVATEKEY_TO_KEYSTORE: '3',
};
