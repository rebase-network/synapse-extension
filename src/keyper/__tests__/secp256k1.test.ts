import Secp256k1LockScript from '../locks/secp256k1';

describe('secp256k1 lockscript', () => {
  test('basic', () => {
    const lock = new Secp256k1LockScript();
    const script = lock.script(
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
});
