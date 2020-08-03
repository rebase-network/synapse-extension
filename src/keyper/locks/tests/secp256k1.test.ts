import _ from 'lodash';
import { Secp256k1LockScript as Secp256k1LockScriptOriginal } from '@keyper/container/lib/locks/secp256k1';
import Secp256k1LockScript from '@src/keyper/locks/secp256k1';
import LOCKS_INFO from '@utils/constants/locksInfo';
import signProvider from '@src/keyper/signProviders/secp256k1';
import { privateKey, rawTx, signedMessage, config } from '@common/fixtures/tx';

describe('secp256k1 lockscript', () => {
  const original = new Secp256k1LockScriptOriginal();
  original.setProvider(signProvider);

  const lockTestnet = new Secp256k1LockScript(
    LOCKS_INFO.testnet.secp256k1.codeHash,
    LOCKS_INFO.testnet.secp256k1.txHash,
    LOCKS_INFO.testnet.secp256k1.hashType,
    original,
  );

  const lockMainnet = new Secp256k1LockScript(
    LOCKS_INFO.mainnet.secp256k1.codeHash,
    LOCKS_INFO.mainnet.secp256k1.txHash,
    LOCKS_INFO.mainnet.secp256k1.hashType,
    original,
  );
  it('should be able get lock script', () => {
    const script = lockMainnet.script(
      '0x020ea44dd70b0116ab44ade483609973adf5ce900d7365d988bc5f352b68abe50b',
    );
    expect(script).toEqual(
      expect.objectContaining({
        args: '0xedcda9513fa030ce4308e29245a22c022d0443bb',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      }),
    );
  });

  it('should have correct depType', () => {
    const deps = lockTestnet.deps();
    expect(deps[0].depType).toEqual('depGroup');
  });

  it('should be able to sign a tx hash', async () => {
    const rawTxCloned = _.cloneDeep(rawTx);
    const signedMsg = await lockTestnet.sign({ privateKey }, rawTxCloned, config);
    expect(signedMsg.witnesses[3]).toBe(signedMessage);
  });

  it('should be able to sign a tx hash', async () => {
    const rawTxCloned = _.cloneDeep(rawTx);
    const signedMsg = await lockMainnet.sign({ privateKey }, rawTxCloned, config);
    expect(signedMsg.witnesses[3]).toBe(signedMessage);
  });
});
