import _ from 'lodash';
import numberToBN from 'number-to-bn';
import * as utils from '@nervosnetwork/ckb-sdk-utils/lib';
import {
  ScriptHashType,
  Script,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
  CellDep,
  DepType,
  SignatureAlgorithm,
} from '@keyper/specs';
import LockWithSignInterface from './interfaces/lockWithSign';

class AnypayLockScript implements LockWithSignInterface {
  public readonly name: string = 'AnyPay';

  protected codeHash: string;

  protected txHash: string;

  private depType: DepType = 'depGroup';

  private index: string = '0x0';

  private hashType: ScriptHashType = 'type';

  private provider: SignProvider;

  private algo: SignatureAlgorithm = SignatureAlgorithm.secp256k1;

  constructor(codeHash: string, txHash: string, hashType: ScriptHashType = 'type') {
    this.codeHash = codeHash;
    this.txHash = txHash;
    this.hashType = hashType;
  }

  public deps(): CellDep[] {
    return [
      {
        outPoint: {
          txHash: this.txHash,
          index: this.index,
        },
        depType: this.depType,
      },
    ];
  }

  public signatureAlgorithm(): SignatureAlgorithm {
    return this.algo;
  }

  public setProvider(provider: SignProvider) {
    this.provider = provider;
  }

  public script(publicKey: string): Script {
    const args = utils.blake160(publicKey);
    return {
      codeHash: this.codeHash,
      hashType: this.hashType,
      args: `0x${Buffer.from(args).toString('hex')}`,
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
      // @ts-ignore
      ...rawTx.witnesses[config.index],
      lock: `0x${'0'.repeat(130)}`,
    };

    const serializedEmptyWitnessBytes = utils.hexToBytes(utils.serializeWitnessArgs(emptyWitness));
    const serialziedEmptyWitnessSize = serializedEmptyWitnessBytes.length;

    const s = utils.blake2b(32, null, null, utils.PERSONAL);
    s.update(utils.hexToBytes(txHash));
    s.update(
      utils.hexToBytes(
        utils.toHexInLittleEndian(`0x${numberToBN(serialziedEmptyWitnessSize).toString(16)}`, 8),
      ),
    );
    s.update(serializedEmptyWitnessBytes);

    for (let i = config.index + 1; i < config.index + config.length; i++) {
      const w = rawTx.witnesses[i];
      // @ts-ignore
      const bytes = utils.hexToBytes(typeof w === 'string' ? w : utils.serializeWitnessArgs(w));
      s.update(
        utils.hexToBytes(
          utils.toHexInLittleEndian(`0x${numberToBN(bytes.length).toString(16)}`, 8),
        ),
      );
      s.update(bytes);
    }

    const message = `0x${s.digest('hex')}`;
    const signd = await this.provider.sign(context, message);
    // @ts-ignore
    rawTx.witnesses[config.index].lock = signd;
    // @ts-ignore
    rawTx.witnesses[config.index] = utils.serializeWitnessArgs(rawTx.witnesses[config.index]);

    return rawTx;
  }
}

export default AnypayLockScript;
