import { SignatureAlgorithm } from '@keyper/specs/lib';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { scriptToAddress } from '@keyper/specs/lib/address';
import * as Keystore from '../wallet/passwordEncryptor';

import init from './setupKeyper';

// eslint-disable-next-line import/order
const EC = require('elliptic').ec;

let container;
const addRules = [];

const generateKeystore = async (privateKey, password) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const ks = await Keystore.encrypt(privateKeyBuffer, password);
  return ks;
};

const setUpContainer = (publicKey) => {
  container.addPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });

  const scripts = container.getScripsByPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });

  scripts.forEach((script) => {
    const addRule = {
      name: 'LockHash',
      data: scriptToHash(script),
    };
    addRules.push(addRule);
  });
};

const generateByPrivateKey = (privateKey, password) => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString('hex');
  const ks = generateKeystore(privateKey, password);

  setUpContainer(publicKey);

  return ks;
};

const accounts = async (networkPrefix: string) => {
  const scripts = await container.getAllLockHashesAndMeta();
  const result = [];

  for (const script of scripts) {
    result.push({
      address: scriptToAddress(script.meta.script, { networkPrefix, short: true }),
      script: script.meta.script,
      type: script.meta.name,
      lock: script.hash,
      amount: 0,
    });
  }

  return result;
};

const signTx = async (lockHash, password, rawTx, config) => {
  const tx = await container.sign(
    {
      lockHash,
      password,
    },
    rawTx,
    config,
  );
  return tx;
};

const getAllLockHashesAndMeta = async () => {
  return container.getAllLockHashesAndMeta();
};

export default {
  init,
  generateByPrivateKey,
  accounts,
  signTx,
  getAllLockHashesAndMeta,
  generateKeystore,
  setUpContainer,
  container,
};
