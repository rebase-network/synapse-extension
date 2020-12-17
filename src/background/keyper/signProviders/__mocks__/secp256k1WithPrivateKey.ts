import {
  aliceAddresses,
  aliceWallet,
  aliceWalletPwd,
  aliceWalletInStorage,
  bobAddresses,
} from '@src/tests/fixture/address';

export const padToEven = (value) => {
  let a = value;
  if (typeof a !== 'string') {
    throw new Error(`value must be string, is currently ${typeof a}, while padToEven.`);
  }
  if (a.length % 2) {
    a = `0${a}`;
  }
  return a;
};

export const sign = (privateKey, message) => {
  console.log(
    'secp256k1WithPrivateKey: mock sign function: privateKey, message: ',
    privateKey,
    message,
  );
  return aliceAddresses.privateKey;
};
