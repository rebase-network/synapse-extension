import {
  SignatureAlgorithm,
  LockScript,
  ScriptHashType,
  Script,
  CellDep,
  RawTransaction,
  Config,
  SignProvider,
  DepType,
  SignContext,
} from '@keyper/specs';

export default class TestLockScript implements LockScript {
  name = 'TestLockScript';

  codeHash = '0x0000000000000000000000000000000000000000000000000000000000000100';

  hashType = 'type' as ScriptHashType;

  provider: SignProvider;

  depsArr = [
    {
      outPoint: {
        txHash: '0x0000000000000000000000000000000000000000000000000000000000000200',
        index: '0x0',
      },
      depType: 'dev_group' as DepType,
    },
  ];

  algo = SignatureAlgorithm.secp256k1;

  constructor(name: string, codeHash: string) {
    this.name = name;
    this.codeHash = codeHash;
  }

  script(publicKey: string): Script {
    return {
      args: publicKey,
      codeHash: this.codeHash,
      hashType: this.hashType,
    };
  }

  deps(): CellDep[] {
    return this.depsArr;
  }

  signatureAlgorithm(): SignatureAlgorithm {
    return this.algo;
  }

  setProvider(provider: SignProvider): void {
    this.provider = provider;
  }

  async sign(
    _context: SignContext,
    rawTx: RawTransaction,
    _config: Config,
  ): Promise<RawTransaction> {
    return rawTx;
  }
}
