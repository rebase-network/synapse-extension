import { addressToScript } from '@keyper/specs/lib/address';
import { aliceAddresses } from '@src/tests/fixture/address';

describe('addressToScript', () => {
  test('secp256k1 address decode to lockscript ', () => {
    const script = addressToScript(aliceAddresses.secp256k1.address);
    expect(script).toEqual(aliceAddresses.secp256k1.script);
  });

  test('anyonepay decode', () => {
    const script = addressToScript(aliceAddresses.anyPay.address);
    expect(script).toEqual(aliceAddresses.anyPay.script);
  });
});
