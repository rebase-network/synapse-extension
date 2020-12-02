import AnypayLockScript from '../anypay';

describe('anypay lockscript', () => {
  const codeHash = '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b';
  const txHash = '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c';
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
});
