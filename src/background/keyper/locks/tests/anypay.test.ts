import { aliceAddresses, aliceWalletPwd } from '@src/tests/fixture/address';
import { rawTx } from '@common/fixtures/tx';
import signProvider from '@background/keyper/signProviders/secp256k1';
import LOCKS_INFO from '@common/utils/constants/locksInfo';
import AnypayLockScript from '../anypay';

describe('anypay lockscript', () => {
  const { codeHash, txHash } = LOCKS_INFO.testnet.anypay;
  const index = '0x0';
  const depType = 'depGroup';

  it('basic', () => {
    const lock = new AnypayLockScript(codeHash, txHash);
    const script = lock.script(
      '0x020ea44dd70b0116ab44ade483609973adf5ce900d7365d988bc5f352b68abe50b',
    );
    expect(script).toEqual(
      expect.objectContaining({
        args: '0xedcda9513fa030ce4308e29245a22c022d0443bb',
        codeHash,
        hashType: 'type',
      }),
    );
  });

  it('deps', () => {
    const lock = new AnypayLockScript(codeHash, txHash);
    const deps = lock.deps();

    expect(deps[0].depType).toEqual('depGroup');

    expect(deps).toEqual([
      {
        outPoint: {
          txHash,
          index,
        },
        depType,
      },
    ]);
  });

  it('sign', async () => {
    const {
      privateKey,
      publicKey,
      secp256k1: { address },
    } = aliceAddresses;
    const lock = new AnypayLockScript(
      LOCKS_INFO.testnet.anypay.codeHash,
      LOCKS_INFO.testnet.anypay.txHash,
      LOCKS_INFO.testnet.anypay.hashType,
    );

    lock.setProvider(signProvider);

    const context = { privateKey, publicKey, address, aliceWalletPwd };

    const result = await lock.sign(context, rawTx);
    const expected =
      '0x5500000010000000550000005500000041000000d1e172abccec16973df781ec6a4a19b0aa9930be7e8ef9b6b7b43d0bda95b9ac4a271ed96e28164c0d15136be5b0d47a1c087aac76b7ce5b8f36caa095f6794a00';
    expect(result.witnesses[0]).toEqual(expected);
  });
});
