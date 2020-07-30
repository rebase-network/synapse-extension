import { LockScript } from '@keyper/container';
import { SignatureAlgorithm } from '@keyper/specs';

// https://basarat.gitbook.io/typescript/type-system/mixins

// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T;

// a mixin that adds a property and methods
export default function CommonLockScript<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    txHash: string;

    depType = 'code';

    index = '0x0';

    hashType = 'type';

    provider = null;

    algo = SignatureAlgorithm.secp256k1;

    deps() {
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

    signatureAlgorithm() {
      return this.algo;
    }

    setProvider(provider) {
      this.provider = provider;
    }
  };
}
