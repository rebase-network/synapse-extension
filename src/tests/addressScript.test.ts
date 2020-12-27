import { addressToScript } from '@keyper/specs/lib/address';
import { secp256k1, anyonepay } from './fixture';

describe('addressToScript', () => {
  test('secp256k1 address decode to lockscript ', () => {
    const script = addressToScript(secp256k1.address);
    expect(script).toEqual(expect.objectContaining(secp256k1.lockScript));
  });

  test('anyonepay decode', () => {
    const script = addressToScript(anyonepay.address);
    expect(script).toEqual(
      expect.objectContaining({
        hashType: anyonepay.lockScript.hashType,
        codeHash: anyonepay.lockScript.codeHash,
        args: anyonepay.lockScript.args,
      }),
    );
  });
});
