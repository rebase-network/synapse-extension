import { aliceAddresses, aliceWallet } from '@src/tests/fixture/address';
import { findInWalletsByPublicKey, showAddressHelper } from '../wallet';

const { publicKey } = aliceAddresses;

describe('wallet utils', () => {
  beforeAll(async () => {
    await browser.storage.local.set({
      publicKeys: [publicKey],
      wallets: [aliceWallet],
    });
  });
  it('findInWalletsByPublicKey', () => {
    const result = findInWalletsByPublicKey(publicKey, [aliceWallet]);
    expect(result).not.toBeNull();
  });

  it('should return address', () => {
    const script = {
      args: '0x60ed0599d4a5c67fd25277243ac12b9f91517b61',
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type',
    };
    const result = showAddressHelper('ckb', script as CKBComponents.Script);
    expect(result).toEqual('ckb1qyqxpmg9n822t3nl6ff8wfp6cy4ely230dssrs7k9z');
  });

  it('should return anypay short address', () => {
    const script = {
      args: '0x81312ae06eeb0504b737e6bcfa5397be35a928de',
      codeHash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
      hashType: 'type',
    };
    const result = showAddressHelper('ckb', script as CKBComponents.Script);
    expect(result).toEqual('ckb1qypgzvf2uphwkpgykum7d0862wtmuddf9r0qw88kle');
  });
});
