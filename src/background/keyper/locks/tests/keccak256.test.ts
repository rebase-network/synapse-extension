import { aliceAddresses, aliceWalletPwd } from '@src/tests/fixture/address';
import { rawTx } from '@common/fixtures/tx';
import signProvider from '@background/keyper/signProviders/secp256k1';
import LOCKS_INFO from '@common/utils/constants/locksInfo';
import Keccak256LockScript from '../keccak256';

describe('keccak lockscript', () => {
  const codeHash = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8';
  const txHash = '0x25635bf587adacf95c9ad302113648f89ecddc2acfe1ea358ea99f715219c4c5';
  const index = '0x0';
  const depType = 'depGroup';

  it('basic', () => {
    const lock = new Keccak256LockScript(codeHash, txHash);
    const script = lock.script(
      '0x020ea44dd70b0116ab44ade483609973adf5ce900d7365d988bc5f352b68abe50b',
    );
    expect(script).toEqual(
      expect.objectContaining({
        args: '0xf7f62b9be3a4aab818dc4e706b7d4fa29738d91b',
        codeHash,
        hashType: 'type',
      }),
    );
  });

  it('deps', () => {
    const lock = new Keccak256LockScript(codeHash, txHash);
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
    const lock = new Keccak256LockScript(
      LOCKS_INFO.testnet.keccak256.codeHash,
      LOCKS_INFO.testnet.keccak256.txHash,
      LOCKS_INFO.testnet.keccak256.hashType,
    );

    lock.setProvider(signProvider);

    const context = { privateKey, publicKey, address, aliceWalletPwd };

    const result = await lock.sign(context, rawTx);
    const expected =
      '0x5500000010000000550000005500000041000000b1998b1641c80d67acabbff4b776b215d10a0426289e073683c0f16d13bee5307ac6d447c41ac1af8984dc805011bee6ee673c025c1131e85ff6bf8c1cb023be00';
    expect(result.witnesses[0]).toEqual(expected);
  });
});
