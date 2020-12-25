import {
  Script,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
  CellDep,
  SignatureAlgorithm,
} from '@keyper/specs';

export default interface LockWithSign {
  deps: () => CellDep[];
  signatureAlgorithm: () => SignatureAlgorithm;
  setProvider: (provider: SignProvider) => void;
  script: (publicKey: string) => Script;
  sign: (
    context: SignContext,
    rawTxParam: RawTransaction,
    configParam: Config,
  ) => Promise<RawTransaction>;
}
