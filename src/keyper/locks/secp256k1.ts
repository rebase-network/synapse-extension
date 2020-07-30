import {
  ScriptHashType,
  Script,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
  LockScript,
} from '@keyper/specs';
import CommonLockScript from './commonLockScript';

class ItsLockScript {
  public readonly name: string = 'Secp256k1';

  protected codeHash: string;

  protected txHash: string;

  protected hashType: ScriptHashType;

  protected provider: SignProvider;

  private secp256k1LockScriptInstance: LockScript;

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

const withMixin = CommonLockScript(ItsLockScript);

export default withMixin;
export { withMixin as Secp256k1LockScript };
