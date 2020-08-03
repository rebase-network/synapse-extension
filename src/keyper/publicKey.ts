import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import { Script } from '@keyper/specs';

export default class PublicKey {
  publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  public getBlake160 = (): string => {
    return `0x${ckbUtils.blake160(`0x${this.publicKey}`, 'hex')}`;
  };

  public publicKeyHash = (): string => {
    return this.getBlake160();
  };

  public getLockHash = (script: Script): string => {
    const lockHash = ckbUtils.scriptToHash(script);

    return lockHash;
  };
}
