// import * as scrypt from 'scrypt.js';
import { SignatureAlgorithm } from '@keyper/specs/lib';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { scriptToAddress } from '@keyper/specs/lib/address';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import * as _ from 'lodash';
import * as Keystore from '../wallet/passwordEncryptor';
import { getKeystoreFromWallets } from '../wallet/addKeyperWallet';
import { getDepFromLockType } from '../utils/deps';
import { ADDRESS_TYPE_CODEHASH } from '../utils/constants';
import { sign as signBySecp256k1 } from './sign';

const { Container } = require('@keyper/container/lib');
const { Secp256k1LockScript } = require('@keyper/container/lib/locks/secp256k1');
const { AnyPayLockScript } = require('@keyper/container/lib/locks/anyone-can-pay');
const Keccak256LockScript = require('./locks/keccak256');

// eslint-disable-next-line import/order
const EC = require('elliptic').ec;

let container;
const addRules = []; // Mod by River

const init = () => {
  container = new Container([
    {
      algorithm: SignatureAlgorithm.secp256k1,
      provider: {
        async sign(context, message) {
          const key = await getKeystoreFromWallets(context.publicKey);
          if (!key) {
            throw new Error(`no key for address: ${context.address}`);
          }
          const privateKeyBuffer = await Keystore.decrypt(key, context.password);
          const Uint8ArrayPk = new Uint8Array(privateKeyBuffer.data);
          const privateKey = ckbUtils.bytesToHex(Uint8ArrayPk);

          const signature = signBySecp256k1(privateKey, message);
          return signature;
        },
      },
    },
  ]);
  container.addLockScript(
    new Secp256k1LockScript(
      ADDRESS_TYPE_CODEHASH.Secp256k1,
      'type',
      getDepFromLockType('Secp256k1'),
    ),
  );
  container.addLockScript(new Keccak256LockScript());
  container.addLockScript(
    new AnyPayLockScript(ADDRESS_TYPE_CODEHASH.AnyPay, 'type', getDepFromLockType('AnyPay')),
  );
};

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

  scripts.forEach(async (script) => {
    const addRule = {
      name: 'LockHash',
      data: scriptToHash(script),
    };
    addRules.push(addRule);
  });
};

const generateByPrivateKey = async (privateKey, password) => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString('hex');
  const ks = generateKeystore(privateKey, password);

  setUpContainer(publicKey);

  return ks;
};

const accounts = async () => {
  const scripts = await container.getAllLockHashesAndMeta();
  const result = [];
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    result.push({
      address: scriptToAddress(script.meta.script, { networkPrefix: 'ckt', short: true }),
      type: script.meta.name,
      lock: script.hash,
      amount: 0,
    });
  }
  return result;
};

async function reCreateCurrentContainer(publicKey) {
  init();
  setUpContainer(publicKey);
}

const signTx = async (lockHash, password, rawTx, config, publicKey) => {
  if (_.isEmpty(container)) {
    await reCreateCurrentContainer(publicKey);
  }

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

module.exports = {
  init,
  generateByPrivateKey,
  accounts,
  signTx,
  getAllLockHashesAndMeta,
  generateKeystore,
  setUpContainer,
  container,
};
