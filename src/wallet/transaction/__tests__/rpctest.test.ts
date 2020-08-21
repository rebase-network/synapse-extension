import { ckbToshannon } from '@src/utils/formatters';
import { privateKeyToAddress, privateKeyToPublicKey } from '@nervosnetwork/ckb-sdk-utils';
import { publicKeyToAddress } from '@src/wallet/address';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Formatter Test', () => {
  const pkLength = 66;
  it('test capacity value', () => {
    const authnPrivateKey = '0xmL3IIGquOOKuCTedY6fqtAx0krRIZ00gs8AErXYM9TFFXz6Hr63OAAI1vMYKZIsL';
    console.log(/authnPrivateKey/, authnPrivateKey);
    const publicKey = privateKeyToPublicKey(authnPrivateKey);
    const address = publicKeyToAddress(publicKey);
    console.log(/address/, address);

    /// /authnPrivateKey/ 0xSZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MFXz4ZYA==SZYN5YgOjGh0
    /// address/ ckt1qyqf7zuzcp5daxyy5mwp7cyj05p6chdwrtwsl87gtf
  });
});
