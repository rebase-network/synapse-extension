// const numberToBN = require("number-to-bn");
// const secp256k1 = require("secp256k1");
// const createKeccakHash = require("keccak");
// const utils = require("@nervosnetwork/ckb-sdk-utils/lib");
// const {
//   SignatureAlgorithm
// } = require("@keyper/specs/lib");

import numberToBN from 'number-to-bn';
import secp256k1 from 'secp256k1';
import createKeccakHash from 'keccak';
import * as utils from '@nervosnetwork/ckb-sdk-utils/lib';
import { SignatureAlgorithm } from '@keyper/specs/lib';

class Keccak256LockScript {
  name = 'Keccak256';
  codeHash = '0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08';
  hashType = 'type';
  provider = null;

  deps() {
    return [
      {
        outPoint: {
          txHash: '0x25635bf587adacf95c9ad302113648f89ecddc2acfe1ea358ea99f715219c4c5',
          index: '0x0',
        },
        depType: 'code',
      },
    ];
  }

  script(publicKey) {
    let pubKey = new Buffer(utils.hexToBytes(publicKey));
    if (pubKey.length !== 64) {
      pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1);
    }

    const args = createKeccakHash('keccak256').update(new Buffer(pubKey)).digest('hex').slice(-40);
    return {
      codeHash: this.codeHash,
      hashType: this.hashType,
      args: `0x${args}`,
    };
  }

  signatureAlgorithm() {
    return SignatureAlgorithm.secp256k1;
  }

  async setProvider(provider) {
    this.provider = provider;
  }

  hashMessage(message) {
    var preamble = '\x19Ethereum Signed Message:\n' + message.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, message]);
    return `0x${createKeccakHash('keccak256').update(ethMessage).digest('hex')}`;
  }

  mergeTypedArraysUnsafe(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
  }

  async sign(context, rawTx, config = { index: 0, length: -1 }) {
    const txHash = utils.rawTransactionToHash(rawTx);

    if (config.length === -1) {
      config.length = rawTx.witnesses.length;
    }

    if (config.length + config.index > rawTx.witnesses.length) {
      throw new Error('request config error');
    }
    if (typeof rawTx.witnesses[config.index] !== 'object') {
      throw new Error('first witness in the group should be type of WitnessArgs');
    }

    const emptyWitness = {
      ...rawTx.witnesses[config.index],
      lock: `0x${'0'.repeat(130)}`,
    };

    const serializedEmptyWitnessBytes = utils.hexToBytes(utils.serializeWitnessArgs(emptyWitness));
    const serialziedEmptyWitnessSize = serializedEmptyWitnessBytes.length;

    let hashBytes = utils.hexToBytes(txHash);
    hashBytes = this.mergeTypedArraysUnsafe(
      hashBytes,
      utils.hexToBytes(
        utils.toHexInLittleEndian(`0x${numberToBN(serialziedEmptyWitnessSize).toString(16)}`, 8),
      ),
    );
    hashBytes = this.mergeTypedArraysUnsafe(hashBytes, serializedEmptyWitnessBytes);

    for (let i = config.index + 1; i < config.index + config.length; i++) {
      const w = rawTx.witnesses[i];
      const bytes = utils.hexToBytes(typeof w === 'string' ? w : utils.serializeWitnessArgs(w));
      hashBytes = this.mergeTypedArraysUnsafe(
        hashBytes,
        utils.hexToBytes(
          utils.toHexInLittleEndian(`0x${numberToBN(bytes.length).toString(16)}`, 8),
        ),
      );
      hashBytes = this.mergeTypedArraysUnsafe(hashBytes, bytes);
    }

    const message = this.hashMessage(
      createKeccakHash('keccak256').update(new Buffer(hashBytes)).digest(),
    );

    const signd = await this.provider.sign(context, message);
    rawTx.witnesses[config.index].lock = signd;
    rawTx.witnesses[config.index] = utils.serializeWitnessArgs(rawTx.witnesses[config.index]);

    return rawTx;
  }
}

module.exports = Keccak256LockScript;
