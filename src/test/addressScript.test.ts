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

  //     test("kaccak256 decode", () => {
  //       const script = addressToScript("ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs3s7nwu6x3pnl82rz3xmqypfhcway723ngkutufp");
  //       expect(script).toEqual(expect.objectContaining({
  //         hashType: "type",
  //         codeHash: "0xa5b896894539829f5e7c5902f0027511f94c70fa2406d509e7c6d1df76b06f08",
  //         args: "0xc3d3773468867f3a86289b6020537c3ba4f2a334"
  //       }));
  //     });
});
