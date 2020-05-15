import * as scrypt from 'scrypt.js';
import { SignatureAlgorithm } from '@keyper/specs/lib';
import { scriptToHash, hexToBytes, bytesToHex } from '@nervosnetwork/ckb-sdk-utils/lib';
import { scriptToAddress } from '@keyper/specs/lib/address';
// import * as Keystore from '@keyper/specs/lib/Keystore';
import * as Keystore from '../wallet/passwordEncryptor';

import { getKeystoreFromWallets } from '../wallet/addKeyperWallet';

const { Container } = require('@keyper/container/lib');
const { Secp256k1LockScript } = require('@keyper/container/lib/locks/secp256k1');
const Keccak256LockScript = require('./locks/keccak256');
const AnyPayLockScript = require('./locks/anypay');
const storage = require('./storage');
const EC = require('elliptic').ec;

let seed, container;
let addRules = []; //Mod by River

const init = () => {
  container = new Container([
    {
      algorithm: SignatureAlgorithm.secp256k1,
      provider: {
        padToEven: function (value) {
          var a = value;
          if (typeof a !== 'string') {
            throw new Error(`value must be string, is currently ${typeof a}, while padToEven.`);
          }
          if (a.length % 2) {
            a = `0${a}`;
          }
          return a;
        },
        sign: async function (context, message) {
          // const key = keys[context.publicKey];
          const key = getKeystoreFromWallets(context.publicKey);
          if (!key) {
            throw new Error(`no key for address: ${context.address}`);
          }
          const privateKey = await Keystore.decrypt(key, context.password); //

          const ec = new EC('secp256k1');
          const keypair = ec.keyFromPrivate(privateKey);
          const msg = typeof message === 'string' ? hexToBytes(message) : message;
          let { r, s, recoveryParam } = keypair.sign(msg, {
            canonical: true,
          });
          if (recoveryParam === null) {
            throw new Error('Fail to sign the message');
          }
          const fmtR = r.toString(16).padStart(64, '0');
          const fmtS = s.toString(16).padStart(64, '0');
          const signature = `0x${fmtR}${fmtS}${this.padToEven(recoveryParam.toString(16))}`;
          return signature;
        },
      },
    },
  ]);
  container.addLockScript(new Secp256k1LockScript());
  container.addLockScript(new Keccak256LockScript());
  container.addLockScript(new AnyPayLockScript());
  // keys = {};
  reloadKeys();
};

const reloadKeys = () => {
  if (storage.keyperStorage().get('keys')) {
    const innerKeys = storage.keyperStorage().get('keys');
    innerKeys.forEach((key) => {
      container.addPublicKey({
        payload: `0x${key.publicKey}`,
        algorithm: SignatureAlgorithm.secp256k1,
      });
      // keys[`0x${key.publicKey}`] = key;
    });
  }
};

// const reloadCacheRuls = async () => {
//   if (storage.keyperStorage().get("keys")) {
//     const innerKeys = storage.keyperStorage().get("keys");
//     innerKeys.forEach(key => {
//       const scripts = container.getScripsByPublicKey({
//         payload: `0x${key.publicKey}`,
//         algorithm: SignatureAlgorithm.secp256k1,
//       });
//       scripts.forEach(async (script) => {
//         // await global.cache.addRule({
//         //   name: "LockHash",
//         //   data: scriptToHash(script),
//         // });
//         const addRule = {
//           name: "LockHash",
//           data: scriptToHash(script),
//         }
//         addRules.push(addRule);
//       });
//     });
//   }
// };

const generateKeystore = async (privateKey, password) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const ks = await Keystore.encrypt(privateKeyBuffer, password);
  return ks;
};

const saveKeystore = (ks, publicKey) => {
  const keys = {};
  ks.publicKey = publicKey;
  if (!storage.keyperStorage().get('keys')) {
    storage.keyperStorage().set('keys', JSON.stringify(ks));
  } else {
    const keys = storage.keyperStorage().get('keys');
    keys.push(JSON.stringify(ks));
    storage.keyperStorage().set('keys', keys);
  }

  // keys[`0x${publicKey}`] = key;
  keys[`0x${publicKey}`] = ks;
  return keys;
};

// const saveKeystoreToWallet = (ks, wallet) => {
//     wallet.Keystore = ks;
// }

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
    // await global.cache.addRule({
    //   name: "LockHash",
    //   data: scriptToHash(script),
    // });
    const addRule = {
      name: 'LockHash',
      data: scriptToHash(script),
    };
    // console.log(" === script === ",script)
    // console.log(" === LockHash === ",scriptToHash(script));
    addRules.push(addRule);
  });
};

const generateByPrivateKey = async (privateKey, password) => {
  
  console.log(privateKey);

  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString('hex');
  // const privateKeyBuffer = Buffer.from(privateKey, "hex")
  // const ks = Keystore.encrypt(privateKeyBuffer, password);
  console.log(privateKey);
  const ks = generateKeystore(privateKey, password);
  // ks.publicKey = publicKey;

  // if (!storage.keyperStorage().get("keys")) {
  //   storage.keyperStorage().set("keys", JSON.stringify(ks));
  // } else {
  //   const keys = storage.keyperStorage().get("keys");
  //   keys.push(JSON.stringify(ks));
  //   storage.keyperStorage().set("keys", keys);
  // }
  saveKeystore(ks, publicKey);

  // keys[`0x${publicKey}`] = key;
  // keys[`0x${publicKey}`] = ks;

  // //container在init中进行初始化的操作;根据PublicKey生成Address
  // container.addPublicKey({
  //   payload: `0x${publicKey}`,
  //   algorithm: SignatureAlgorithm.secp256k1,
  // });

  // const scripts = container.getScripsByPublicKey({
  //   payload: `0x${publicKey}`,
  //   algorithm: SignatureAlgorithm.secp256k1,
  // });

  // scripts.forEach(async (script) => {
  //   // await global.cache.addRule({
  //   //   name: "LockHash",
  //   //   data: scriptToHash(script),
  //   // });
  //   const addRule = {
  //     name: "LockHash",
  //     data: scriptToHash(script),
  //   }
  //   // console.log(" === script === ",script)
  //   // console.log(" === LockHash === ",scriptToHash(script));
  //   addRules.push(addRule);
  // });
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

const signTx = async (lockHash, password, rawTx, config) => {
  const tx = await container.sign(
    {
      lockHash: lockHash,
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
  // createPassword,
  // getSeed,
  // unlock,
  // exists,
  generateByPrivateKey,
  accounts,
  signTx,
  getAllLockHashesAndMeta,
  // reloadCacheRuls,
  generateKeystore,
  saveKeystore,
  setUpContainer,
};
