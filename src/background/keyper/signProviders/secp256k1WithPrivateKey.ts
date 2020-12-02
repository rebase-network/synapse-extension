import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils/lib';

const EC = require('elliptic').ec;

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
  const ec = new EC('secp256k1');
  const keypair = ec.keyFromPrivate(privateKey.replace('0x', ''));

  const msg = typeof message === 'string' ? hexToBytes(message) : message;
  const { r, s, recoveryParam } = keypair.sign(msg, {
    canonical: true,
  });
  if (recoveryParam === null) {
    throw new Error('Fail to sign the message');
  }
  const fmtR = r.toString(16).padStart(64, '0');
  const fmtS = s.toString(16).padStart(64, '0');
  const signature = `0x${fmtR}${fmtS}${padToEven(recoveryParam.toString(16))}`;
  return signature;
};
