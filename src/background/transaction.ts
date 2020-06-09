import Axios, { AxiosRequestConfig } from 'axios';
const { Secp256k1LockScript } = require('@keyper/container/lib/locks/secp256k1');
const Keccak256LockScript = require('../keyper/locks/keccak256');
const AnyPayLockScript = require('../keyper/locks/anypay');
import { configService } from '../config';

export const getTxHistories = async (scriptObj): Promise<any> => {
  const url = `${configService.CACHE_LAYER_ENDPOINT}/cell/getTxHistories`;
  const result = await Axios.post(url, scriptObj);
  return result.data;
};

export const createScriptObj = (publicKey, type, address) => {
  if (type == 'Secp256k1') {
    const secp256k1 = new Secp256k1LockScript();
    const secp256k1Script = secp256k1.script(publicKey);
    const scriptObj = {
      script: {
        args: secp256k1Script.args,
        code_hash: secp256k1Script.codeHash,
        hash_type: 'type',
      },
      scriptType: 'lock',
      address: address,
    };
    return scriptObj;
  } else if (type == 'AnyPay') {
    const anypay = new AnyPayLockScript();
    const anypayScript = anypay.script(publicKey);
    const scriptObj = {
      script: {
        args: anypayScript.args,
        code_hash: anypayScript.codeHash,
        hash_type: 'type',
      },
      scriptType: 'lock',
      address: address,
    };
    return scriptObj;
  } else if (type == 'Keccak256') {
    const keccak256 = new Keccak256LockScript();
    const keccak256Script = keccak256.script(publicKey);
    const scriptObj = {
      script: {
        args: keccak256Script.args,
        code_hash: keccak256Script.codeHash,
        hash_type: 'type',
      },
      scriptType: 'lock',
      address: address,
    };
    return scriptObj;
  }
};
