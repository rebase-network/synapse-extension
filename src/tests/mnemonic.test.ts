import crypto from 'crypto';

// import Address, { AddressType, AddressPrefix } from './address'
// import Keychain, { privateToPublic } from './keychain'
import { entropyToMnemonic } from '../wallet/mnemonic';

// Generate 12 words mnemonic code
export const generateMnemonic = () => {
  const entropySize = 16;
  const entropy = crypto.randomBytes(entropySize).toString('hex');
  return entropyToMnemonic(entropy);
};

describe('mnemonic test', () => {
  it('generate mnemonic', () => {
    const mnemonic = generateMnemonic();
    console.log(mnemonic);
  });
});
