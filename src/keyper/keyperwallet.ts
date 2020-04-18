import * as scrypt from "scrypt.js";
import { SignatureAlgorithm } from "@keyper/specs/lib";
import { Container } from "@keyper/container/lib";
import { scriptToHash, hexToBytes } from "@nervosnetwork/ckb-sdk-utils/lib";
import { scriptToAddress } from "@keyper/specs/lib/address";
import * as keystore from "@keyper/specs/lib/keystore";

const EC = require("elliptic").ec;
const { Secp256k1LockScript } = require("@keyper/container/lib/locks/secp256k1");
const Keccak256LockScript = require("./locks/keccak256");
const AnyPayLockScript = require("./locks/anypay");
const storage = require("./storage");

let seed, keys, container;
let addRules = []; //Mod by River

const init = () => {
  container = new Container([{
    algorithm: SignatureAlgorithm.secp256k1,
    provider: {
      padToEven: function(value) {
        var a = value;
        if (typeof a !== 'string') {
          throw new Error(`value must be string, is currently ${typeof a}, while padToEven.`);
        }
        if (a.length % 2) {
          a = `0${a}`;
        }
        return a;
      },
      sign: async function(context, message) {
        const key = keys[context.publicKey];
        if (!key) {
          throw new Error(`no key for address: ${context.address}`);
        }
        const privateKey = keystore.decrypt(key, context.password);

        const ec = new EC('secp256k1');
        const keypair = ec.keyFromPrivate(privateKey);
        const msg = typeof message === 'string' ? hexToBytes(message) : message;
        let { r, s, recoveryParam } = keypair.sign(msg, {
          canonical: true,
        });
        if (recoveryParam === null){
          throw new Error('Fail to sign the message');
        }
        const fmtR = r.toString(16).padStart(64, '0');
        const fmtS = s.toString(16).padStart(64, '0');
        const signature = `0x${fmtR}${fmtS}${this.padToEven(recoveryParam.toString(16))}`;
        return signature;
      }
    }
  }]);
  container.addLockScript(new Secp256k1LockScript());
  container.addLockScript(new Keccak256LockScript());
  container.addLockScript(new AnyPayLockScript());
  keys = {};
  reloadKeys();
};

const reloadKeys = () => {
  if (storage.keyperStorage().get("keys")) {
    const innerKeys = storage.keyperStorage().get("keys");
    innerKeys.forEach(key => {
      container.addPublicKey({
        payload: `0x${key.publicKey}`,
        algorithm: SignatureAlgorithm.secp256k1,
      });
      keys[`0x${key.publicKey}`] = key;
    });
  }
};

const reloadCacheRuls = async () => {
  if (storage.keyperStorage().get("keys")) {
    const innerKeys = storage.keyperStorage().get("keys");
    innerKeys.forEach(key => {
      const scripts = container.getScripsByPublicKey({
        payload: `0x${key.publicKey}`,
        algorithm: SignatureAlgorithm.secp256k1,
      });
      scripts.forEach(async (script) => {
        // await global.cache.addRule({
        //   name: "LockHash",
        //   data: scriptToHash(script),
        // });
        const addRule = {
          name: "LockHash",
          data: scriptToHash(script),
        }
        addRules.push(addRule);        
      });
    });
  }
};

const hashPassword = (password) => {
  const salt = storage.getSalt();
  return scrypt(password, salt, 16384, 8, 1, 16);
};

const passwordToSeed = (password) => {
  const hash = hashPassword(password);
  return hash;
};

const createPassword = async (password) => {
  seed = await passwordToSeed(password);
  storage.keyperStorage().set("seed", seed.toString("hex"));
};

const getSeed = () => seed;

const exists = () => {
  const s = storage.keyperStorage().get("seed");
  return s !== undefined;
};

const unlock = async (password) => {
  const hash = passwordToSeed(password).toString("hex");
  const s = storage.keyperStorage().get("seed");
  if (s === hash) {
    seed = hash;
    return true;
  }
  return false;
};

//001- Create的逻辑
const generateKey = async (password) => {
  const ec = new EC('secp256k1');
  const key = ec.genKeyPair();
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString("hex");
  const privateKey = key.getPrivate();

  const privateKeyBuffer = Buffer.from(privateKey, "hex")
  const ks = keystore.encrypt(privateKeyBuffer, password);
  ks.publicKey = publicKey;

  if (!storage.keyperStorage().get("keys")) {
    storage.keyperStorage().set("keys", [ks]);
  } else {
    const keys = storage.keyperStorage().get("keys");
    keys.push(ks);
    storage.keyperStorage().set("keys", keys);
  }
  console.log("=== storage.keyperStorage() === ", storage.keyperStorage());

  //container在init中进行初始化的操作
  container.addPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });
  keys[`0x${publicKey}`] = key;
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
      name: "LockHash",
      data: scriptToHash(script),
    }
    addRules.push(addRule);
  });

  return publicKey;
};

const generateKeyPrivateKey = async (password,privateKey) => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  // const key = ec.genKeyPair();
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString("hex");
  // const privateKey = key.getPrivate();
  const privateKeyBuffer = Buffer.from(privateKey, "hex")
  const ks = keystore.encrypt(privateKeyBuffer, password);
  ks.publicKey = publicKey;

  if (!storage.keyperStorage().get("keys")) {
    storage.keyperStorage().set("keys", [ks]);
  } else {
    const keys = storage.keyperStorage().get("keys");
    keys.push(ks);
    storage.keyperStorage().set("keys", keys);
  }

  //container在init中进行初始化的操作
  container.addPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });
  keys[`0x${publicKey}`] = key;
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
      name: "LockHash",
      data: scriptToHash(script),
    }
    addRules.push(addRule);
  });

  return publicKey;
};

//002-导入的逻辑
const importKey = async (privateKey, password) => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = Buffer.from(key.getPublic().encodeCompressed()).toString("hex");
  const ks = keystore.encrypt(Buffer.from(privateKey, "hex"), password);
  ks.publicKey = publicKey;

  if (!storage.keyperStorage().get("keys")) {
    storage.keyperStorage().set("keys", [ks]);
  } else {
    const keys = storage.keyperStorage().get("keys");
    keys.push(ks);
    storage.keyperStorage().set("keys", keys);
  }

  const scripts = container.getScripsByPublicKey({
    payload: `0x${publicKey}`,
    algorithm: SignatureAlgorithm.secp256k1,
  });
  scripts.forEach(async (script) => {
    // await global.cache.addRule({
    //   name: "LockHash",
    //   data: scriptToHash(script),
    // }, "1000");
    // TODO 1000 应该怎么修改？ ===============Problem
      const addRule = {
        name: "LockHash",
        data: scriptToHash(script),
      }
      addRules.push(addRule);    
  });
  return publicKey;
};

const accounts = async () => {
  const scripts = await container.getAllLockHashesAndMeta();
  const result = [];
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    result.push({
      address: scriptToAddress(script.meta.script, {networkPrefix: "ckt", short: true}),
      type: script.meta.name,
      lock: script.hash,
      amount: 0,
    });
  }
  return result;
}

const signTx = async (lockHash, password, rawTx, config) => {
  const tx = await container.sign({
    lockHash: lockHash,
    password,
  }, rawTx, config);
  console.log(JSON.stringify(rawTx));
  return tx;
}

const getAllLockHashesAndMeta = async () => {
  return container.getAllLockHashesAndMeta();
}

module.exports = {
  init,
  createPassword,
  getSeed,
  unlock,
  exists,
  generateKey,
  generateKeyPrivateKey,
  importKey,
  accounts,
  signTx,
  getAllLockHashesAndMeta,
  reloadCacheRuls,
};
