export const MAX_NETWORK_NAME_LENGTH = 28;
export const MAX_WALLET_NAME_LENGTH = 20;
export const ADDRESS_LENGTH = 46;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;
export const MIN_AMOUNT = 61;
export const SINCE_FIELD_SIZE = 8;
export const PAGE_SIZE = 15;
export const UNREMOVABLE_NETWORK = 'Testnet';
export const UNREMOVABLE_NETWORK_ID = '0';
export const CONFIRMATION_THRESHOLD = 300;
export const MAX_TIP_BLOCK_DELAY = 180000;

export const MAX_DECIMAL_DIGITS = 8;
export const MAINNET_TAG = 'ckb';

export const MIN_DEPOSIT_AMOUNT = 102;

export const SHANNON_CKB_RATIO = 1e8;

export const MEDIUM_FEE_RATE = 6000;
export const WITHDRAW_EPOCHS = 180;
export const IMMATURE_EPOCHS = 4;
export const MILLISECONDS_IN_YEAR = 365 * 24 * 3600 * 1000;

export enum CapacityUnit {
  CKB = 'ckb',
  CKKB = 'ckkb',
  CKGB = 'ckgb',
}

export enum Price {
  Immediately = '18000',
  TenBlocks = '6000',
  HundredBlocks = '3000',
  FiveHundredsBlocks = '0',
}

export enum ErrorCode {
  // Errors from RPC
  ErrorFromRPC = -3,
  // Errors from neuron-wallet
  AmountNotEnough = 100,
  AmountTooSmall = 101,
  PasswordIncorrect = 103,
  NodeDisconnected = 104,
  CapacityNotEnoughForChange = 105,
  LocktimeAmountTooSmall = 107,
  AddressNotFound = 108,
  // Parameter validation errors from neuron-ui
  FieldRequired = 201,
  FieldUsed = 202,
  FieldTooLong = 203,
  FieldTooShort = 204,
  FieldInvalid = 205,
  DecimalExceed = 206,
  NotNegative = 207,
  ProtocolRequired = 208,
  NoWhiteSpaces = 209,
  FieldIrremovable = 301,
  FieldNotFound = 303,
  CameraUnavailable = 304,
  AddressIsEmpty = 305,
  MainnetAddressRequired = 306,
  TestnetAddressRequired = 307,
}

export enum SyncStatus {
  FailToFetchTipBlock,
  SyncNotStart,
  SyncPending,
  Syncing,
  SyncCompleted,
}

export enum PRESET_SCRIPT {
  Locktime = 'SingleMultiSign',
}
