import { aliceAddresses } from '@src/tests/fixture/address';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sign = (privateKey, message) => {
  return aliceAddresses.privateKey;
};
