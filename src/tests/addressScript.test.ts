import { addressToScript } from '@keyper/specs/lib/address';
import { aliceAddresses } from '@src/tests/fixture/address';
import LOCKS_INFO from '@common/utils/constants/locksInfo';

describe('addressToScript', () => {
  test('secp256k1 decode', () => {
    const script = addressToScript(aliceAddresses.secp256k1.address);
    expect(script).toEqual(
      expect.objectContaining({
        hashType: LOCKS_INFO.testnet.secp256k1.hashType,
        codeHash: LOCKS_INFO.testnet.secp256k1.codeHash,
        args: aliceAddresses.args,
      }),
    );
  });

  test('anyonepay decode', () => {
    const script = addressToScript(aliceAddresses.anyPay.address);
    expect(script).toEqual(
      expect.objectContaining({
        hashType: LOCKS_INFO.testnet.anypay.hashType,
        codeHash: LOCKS_INFO.testnet.anypay.codeHash,
        args: aliceAddresses.args,
      }),
    );
  });
});
