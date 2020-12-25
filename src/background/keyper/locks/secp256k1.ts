import {
  ScriptHashType,
  Script,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
  LockScript,
  CellDep,
  DepType,
  SignatureAlgorithm,
} from '@keyper/specs';
import LockWithSignInterface from './interfaces/lockWithSign';

class Secp256k1LockScript implements LockWithSignInterface {
  public readonly name: string = 'Secp256k1';

  protected codeHash: string;

  protected txHash: string;

  private secp256k1LockScriptInstance: LockScript;

  private depType: DepType = 'depGroup';

  private index: string = '0x0';

  private hashType: ScriptHashType = 'type';

  private provider: SignProvider;

  private algo: SignatureAlgorithm = SignatureAlgorithm.secp256k1;

  constructor(
    codeHash: string,
    txHash: string,
    hashType: ScriptHashType = 'type',
    secp256k1LockScriptInstance: LockScript,
  ) {
    this.codeHash = codeHash;
    this.txHash = txHash;
    this.hashType = hashType;
    this.secp256k1LockScriptInstance = secp256k1LockScriptInstance;
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
    return this.secp256k1LockScriptInstance.script(publicKey);
  }

  public async sign(
    context: SignContext,
    rawTx: RawTransaction,
    config: Config = { index: 0, length: -1 },
  ): Promise<RawTransaction> {
    return this.secp256k1LockScriptInstance.sign(context, rawTx, config);
  }
}

export default Secp256k1LockScript;
