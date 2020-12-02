import { ScriptHashType, CellDep, SignatureAlgorithm, SignProvider, DepType } from '@keyper/specs';

// https://basarat.gitbook.io/typescript/type-system/mixins
// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T;

// a mixin that adds a property and methods
export default function CommonLockScript<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private txHash: string;

    private depType: DepType = 'depGroup';

    private index: string = '0x0';

    private hashType: ScriptHashType = 'type';

    private provider: SignProvider;

    private algo: SignatureAlgorithm = SignatureAlgorithm.secp256k1;

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
  };
}
