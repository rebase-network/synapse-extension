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
});
