import { generateMnemonic } from '../wallet/key';
import Keychain from '../wallet/keychain';
import { mnemonicToSeedSync } from '../wallet/mnemonic';

const fixture = {
  entropy: '7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f',
  mnemonic: 'legal winner thank year wave sausage worth useful legal winner thank yellow',
  seed:
    '878386efb78845b3355bd15ea4d39ef97d179cb712b77d5c12b6be415fffeffe5f377ba02bf3f8544ab800b955e51fbff09828f682052a20faa6addbbddfb096',
};

describe('wallet', () => {
  const longSeed = Buffer.from(
    'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542',
    'hex',
  );

  it('should mnemonic length is 12', () => {
    const words = generateMnemonic();
    expect(words.split(' ').length).toEqual(12);
  });

  it('should check seed', () => {
    const seed = mnemonicToSeedSync(fixture.mnemonic);
    expect(seed.toString('hex')).toEqual(fixture.seed);
  });

  it('create master keychain from long seed', () => {
    const master = Keychain.fromSeed(longSeed);
    expect(master.privateKey.toString('hex')).toEqual(
      '4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e',
    );
    expect(master.identifier.toString('hex')).toEqual('bd16bee53961a47d6ad888e29545434a89bdfe95');
    expect(master.fingerprint).toEqual(3172384485);
    expect(master.chainCode.toString('hex')).toEqual(
      '60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689',
    );
    expect(master.index).toEqual(0);
    expect(master.depth).toEqual(0);
    expect(master.parentFingerprint).toEqual(0);
  });
});
