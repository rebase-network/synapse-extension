import crypto from 'crypto';
import blake2b from 'blake2b';
import randomBytes from 'randombytes';
import scrypt from 'scrypt.js';
import { v4 as uuidv4 } from 'uuid';

interface V3Params {
  kdf: string;
  cipher: string;
  salt: string | Buffer;
  iv: string | Buffer;
  uuid: string | Buffer;
  dklen: number;
  c: number;
  n: number;
  r: number;
  p: number;
}

interface V3ParamsStrict {
  kdf: string;
  cipher: string;
  salt: Buffer;
  iv: Buffer;
  uuid: Buffer;
  dklen: number;
  c: number;
  n: number;
  r: number;
  p: number;
}

function validateHexString(paramName: string, str: string, length?: number) {
  if (str.toLowerCase().startsWith('0x')) {
    str = str.slice(2);
  }
  if (!str && !length) {
    return str;
  }
  if ((length as number) % 2) {
    throw new Error('Invalid length argument, must be an even number');
  }
  if (typeof length === 'number' && str.length !== length) {
    throw new Error(`Invalid ${paramName}, string must be ${length} hex characters`);
  }
  if (!/^([0-9a-f]{2})+$/i.test(str)) {
    const howMany = typeof length === 'number' ? length : 'empty or a non-zero even number of';
    throw new Error(`Invalid ${paramName}, string must be ${howMany} hex characters`);
  }
  return str;
}

function validateBuffer(paramName: string, buff: Buffer, length?: number) {
  if (!Buffer.isBuffer(buff)) {
    const howManyHex =
      typeof length === 'number' ? `${length * 2}` : 'empty or a non-zero even number of';
    const howManyBytes = typeof length === 'number' ? ` (${length} bytes)` : '';
    throw new Error(
      `Invalid ${paramName}, must be a string (${howManyHex} hex characters) or buffer${howManyBytes}`,
    );
  }
  if (typeof length === 'number' && buff.length !== length) {
    throw new Error(`Invalid ${paramName}, buffer must be ${length} bytes`);
  }
  return buff;
}

function mergeToV3ParamsWithDefaults(params?: Partial<V3Params>): V3ParamsStrict {
  const v3Defaults: V3ParamsStrict = {
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    salt: randomBytes(32),
    iv: randomBytes(16),
    uuid: randomBytes(16),
    dklen: 32,
    c: 262144,
    n: 262144,
    r: 8,
    p: 1,
  };

  if (!params) {
    return v3Defaults;
  }

  if (typeof params.salt === 'string') {
    params.salt = Buffer.from(validateHexString('salt', params.salt), 'hex');
  }
  if (typeof params.iv === 'string') {
    params.iv = Buffer.from(validateHexString('iv', params.iv, 32), 'hex');
  }
  if (typeof params.uuid === 'string') {
    params.uuid = Buffer.from(validateHexString('uuid', params.uuid, 32), 'hex');
  }

  if (params.salt) {
    validateBuffer('salt', params.salt);
  }
  if (params.iv) {
    validateBuffer('iv', params.iv, 16);
  }
  if (params.uuid) {
    validateBuffer('uuid', params.uuid, 16);
  }

  return {
    ...v3Defaults,
    ...(params as V3ParamsStrict),
  };
}

// KDF

const enum KDFFunctions {
  PBKDF = 'pbkdf2',
  Scrypt = 'scrypt',
}

interface ScryptKDFParams {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: Buffer;
}

interface ScryptKDFParamsOut {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: string;
}

interface PBKDFParams {
  c: number;
  dklen: number;
  prf: string;
  salt: Buffer;
}

interface PBKDFParamsOut {
  c: number;
  dklen: number;
  prf: string;
  salt: string;
}

type KDFParams = ScryptKDFParams | PBKDFParams;
type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut;

function kdfParamsForPBKDF(opts: V3ParamsStrict): PBKDFParams {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    c: opts.c,
    prf: 'hmac-sha256',
  };
}

function kdfParamsForScrypt(opts: V3ParamsStrict): ScryptKDFParams {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    n: opts.n,
    r: opts.r,
    p: opts.p,
  };
}

export interface V3Keystore {
  crypto: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
    kdf: string;
    kdfparams: KDFParamsOut;
    mac: string;
  };
  id: string;
  version: number;
}

function runCipherBuffer(cipher: crypto.Cipher | crypto.Decipher, data: Buffer): Buffer {
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

function mac(derivedKey: Buffer, ciphertext: Buffer): Buffer {
  const mac = blake2b(32)
    .update(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]))
    .digest('hex');

  return mac;
}

function getDerivedKey(password: string, opts?: Partial<V3Params>): Buffer {
  const v3Params: V3ParamsStrict = mergeToV3ParamsWithDefaults(opts);

  let kdfParams: KDFParams;
  let derivedKey: Buffer;
  switch (v3Params.kdf) {
    case KDFFunctions.PBKDF:
      kdfParams = kdfParamsForPBKDF(v3Params);
      derivedKey = crypto.pbkdf2Sync(
        Buffer.from(password),
        kdfParams.salt,
        kdfParams.c,
        kdfParams.dklen,
        'sha256',
      );
      break;
    case KDFFunctions.Scrypt:
      kdfParams = kdfParamsForScrypt(v3Params);
      derivedKey = scrypt(
        Buffer.from(password),
        kdfParams.salt,
        kdfParams.n,
        kdfParams.r,
        kdfParams.p,
        kdfParams.dklen,
      );
      break;
    default:
      throw new Error('Unsupported kdf');
  }

  return derivedKey;
}

export function encrypt(privKey: Buffer, password: string, opts?: Partial<V3Params>): V3Keystore {
  const v3Params: V3ParamsStrict = mergeToV3ParamsWithDefaults(opts);

  let kdfParams: KDFParams;
  let derivedKey: Buffer;
  switch (v3Params.kdf) {
    case KDFFunctions.PBKDF:
      kdfParams = kdfParamsForPBKDF(v3Params);
      derivedKey = crypto.pbkdf2Sync(
        Buffer.from(password),
        kdfParams.salt,
        kdfParams.c,
        kdfParams.dklen,
        'sha256',
      );
      break;
    case KDFFunctions.Scrypt:
      kdfParams = kdfParamsForScrypt(v3Params);
      derivedKey = scrypt(
        Buffer.from(password),
        kdfParams.salt,
        kdfParams.n,
        kdfParams.r,
        kdfParams.p,
        kdfParams.dklen,
      );
      break;
    default:
      throw new Error('Unsupported kdf');
  }

  const cipher: crypto.Cipher = crypto.createCipheriv(
    v3Params.cipher,
    derivedKey.slice(0, 16),
    v3Params.iv,
  );
  if (!cipher) {
    throw new Error('Unsupported cipher');
  }

  const ciphertext = runCipherBuffer(cipher, privKey);
  const macStr = mac(derivedKey, ciphertext).toString('hex');

  return {
    version: 3,
    id: uuidv4({ random: v3Params.uuid }),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: { iv: v3Params.iv.toString('hex') },
      cipher: v3Params.cipher,
      kdf: v3Params.kdf,
      kdfparams: {
        ...kdfParams,
        salt: kdfParams.salt.toString('hex'),
      },
      mac: macStr,
    },
  };
}

export function decrypt(
  input: string | V3Keystore,
  password: string,
  nonStrict: boolean = false,
): string {
  const json: V3Keystore =
    typeof input === 'object' ? input : JSON.parse(nonStrict ? input.toLowerCase() : input);

  if (json.version !== 3) {
    throw new Error('Not a V3 wallet');
  }

  let derivedKey: Buffer;
  let kdfparams: any;

  if (json.crypto.kdf === 'scrypt') {
    kdfparams = json.crypto.kdfparams;

    derivedKey = scrypt(
      Buffer.from(password),
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.n,
      kdfparams.r,
      kdfparams.p,
      kdfparams.dklen,
    );
  } else if (json.crypto.kdf === 'pbkdf2') {
    kdfparams = json.crypto.kdfparams;

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2');
    }

    derivedKey = crypto.pbkdf2Sync(
      Buffer.from(password),
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.c,
      kdfparams.dklen,
      'sha256',
    );
  } else {
    throw new Error('Unsupported key derivation scheme');
  }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
  const mac = blake2b(32)
    .update(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]))
    .digest('hex');
  if (mac.toString('hex') !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase');
  }

  const decipher = crypto.createDecipheriv(
    json.crypto.cipher,
    derivedKey.slice(0, 16),
    Buffer.from(json.crypto.cipherparams.iv, 'hex'),
  );
  const seed = runCipherBuffer(decipher, ciphertext);
  return seed.toString('hex');
}

export function checkPasswd(input: string | V3Keystore, password: string): boolean {
  const json: V3Keystore = typeof input === 'object' ? input : JSON.parse(input);

  if (json.version !== 3) {
    throw new Error('Not a V3 wallet');
  }

  let derivedKey: Buffer;
  let kdfparams: any;

  if (json.crypto.kdf === 'scrypt') {
    kdfparams = json.crypto.kdfparams;

    derivedKey = scrypt(
      Buffer.from(password),
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.n,
      kdfparams.r,
      kdfparams.p,
      kdfparams.dklen,
    );
  } else if (json.crypto.kdf === 'pbkdf2') {
    kdfparams = json.crypto.kdfparams;

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2');
    }

    derivedKey = crypto.pbkdf2Sync(
      Buffer.from(password),
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.c,
      kdfparams.dklen,
      'sha256',
    );
  } else {
    throw new Error('Unsupported key derivation scheme');
  }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
  const res = mac(derivedKey, ciphertext).toString('hex');
  return res === json.crypto.mac;
}
