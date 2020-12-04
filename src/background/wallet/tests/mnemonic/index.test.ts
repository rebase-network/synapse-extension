import {
  entropyToMnemonic,
  mnemonicToEntropy,
  mnemonicToSeed,
  mnemonicToSeedSync,
  validateMnemonic,
} from '../../mnemonic';

const fixtures = require('./fixtures.json');

describe('mnemonic', () => {
  it('generate, validate mnemonic', () => {
    fixtures.vectors.map(
      async ({ entropy, mnemonic }: { entropy: string; mnemonic: string; seed: string }) => {
        expect(validateMnemonic(mnemonic)).toBe(true);
        expect(entropyToMnemonic(entropy)).toBe(mnemonic);
        expect(mnemonicToEntropy(mnemonic)).toBe(entropy);
      },
    );
  });

  it('generate seed', () => {
    fixtures.vectors.map(
      async ({ mnemonic, seed }: { entropy: string; mnemonic: string; seed: string }) => {
        expect(await mnemonicToSeed(mnemonic).then((s) => s.toString('hex'))).toBe(seed);
        expect(mnemonicToSeedSync(mnemonic).toString('hex')).toBe(seed);
      },
    );
  });
});
