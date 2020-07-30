import _ from 'lodash';
import numberToBN from 'number-to-bn';
import secp256k1 from 'secp256k1';
import createKeccakHash from 'keccak';
import * as utils from '@nervosnetwork/ckb-sdk-utils/lib';
import {
  ScriptHashType,
  Script,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
} from '@keyper/specs';
import CommonLockScript from './commonLockScript';

function hashMessage(message) {
  const preamble = `\x19Ethereum Signed Message:\n${message.length}`;
  const preambleBuffer = Buffer.from(preamble);
  const ethMessage = Buffer.concat([preambleBuffer, message]);
  return `0x${createKeccakHash('keccak256').update(ethMessage).digest('hex')}`;
}

function mergeTypedArraysUnsafe(a, b) {
  const c = new a.constructor(a.length + b.length);
  c.set(a);
  c.set(b, a.length);

  return c;
}

class ItsLockScript {
  public readonly name: string = 'Keccak256';

  protected codeHash: string;

  protected txHash: string;

  protected hashType: ScriptHashType;

  protected provider: SignProvider;

  constructor(codeHash: string, txHash: string, hashType: ScriptHashType = 'type') {
    this.codeHash = codeHash;
    this.txHash = txHash;
    this.hashType = hashType;
  }

  public script(publicKey: string): Script {
    let pubKey = Buffer.from(utils.hexToBytes(publicKey));
    if (pubKey.length !== 64) {
      pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1);
    }

    const args = createKeccakHash('keccak256').update(Buffer.from(pubKey)).digest('hex').slice(-40);
    return {
      codeHash: this.codeHash,
      hashType: this.hashType,
      args: `0x${args}`,
    };
  }

  public async sign(
    context: SignContext,
    rawTxParam: RawTransaction,
    configParam: Config = { index: 0, length: -1 },
  ) {
    const rawTx = _.cloneDeep(rawTxParam);
    const config = _.cloneDeep(configParam);
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
    hashBytes = mergeTypedArraysUnsafe(
      hashBytes,
      utils.hexToBytes(
        utils.toHexInLittleEndian(`0x${numberToBN(serialziedEmptyWitnessSize).toString(16)}`, 8),
      ),
    );
    hashBytes = mergeTypedArraysUnsafe(hashBytes, serializedEmptyWitnessBytes);

    for (let i = config.index + 1; i < config.index + config.length; i++) {
      const w = rawTx.witnesses[i];
      const bytes = utils.hexToBytes(typeof w === 'string' ? w : utils.serializeWitnessArgs(w));
      hashBytes = mergeTypedArraysUnsafe(
        hashBytes,
        utils.hexToBytes(
          utils.toHexInLittleEndian(`0x${numberToBN(bytes.length).toString(16)}`, 8),
        ),
      );
      hashBytes = mergeTypedArraysUnsafe(hashBytes, bytes);
    }

    const message = hashMessage(
      createKeccakHash('keccak256').update(Buffer.from(hashBytes)).digest(),
    );

    const signd = await this.provider.sign(context, message);
    rawTx.witnesses[config.index].lock = signd;
    rawTx.witnesses[config.index] = utils.serializeWitnessArgs(rawTx.witnesses[config.index]);

    return rawTx;
  }
}

const withMixin = CommonLockScript(ItsLockScript);

export default withMixin;
export { withMixin as Keccak256LockScript };
