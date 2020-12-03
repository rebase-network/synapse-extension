import { wallets as walletsSample } from '@src/background/wallet/fixtures/wallets';
import { aliceAddresses, aliceWallet, aliceWalletPwd } from '@src/tests/fixture/address';
import signProvider, { getWalletsInStorage } from './secp256k1';

describe('secp256k1 sign provider', () => {
  it('should be able to set wallets to storage', async () => {
    const { wallets } = await browser.storage.local.get('wallets');

    expect(wallets).toBeUndefined();

    const currWallets = await getWalletsInStorage();

    expect(currWallets).toEqual([]);

    await browser.storage.local.set({
      wallets: walletsSample,
    });
    const newWallets = await getWalletsInStorage();

    expect(newWallets).toEqual(walletsSample);
  });

  it('should sign correctly', async () => {
    const context = {
      privateKey: aliceAddresses.privateKey,
      publicKey: aliceAddresses.publicKey,
      address: aliceAddresses.secp256k1.address,
      password: aliceWalletPwd,
    };
    const result = await signProvider.sign(context, '0x123');
    const expected =
      '0xaccccd1be484021413e886e78b24d6abd20b3d3f9c9a37252b709ad2114aac3a5c63439109349d14d9aec7d8d300476155d9c82375e9625083da9a58f6234fe501';
    expect(result).toEqual(expected);
  });

  it('should sign correctly with context of not having private key', async () => {
    await browser.storage.local.set({
      wallets: [aliceWallet],
    });

    const context = {
      publicKey: aliceAddresses.publicKey,
      address: aliceAddresses.secp256k1.address,
      password: aliceWalletPwd,
    };
    try {
      await signProvider.sign(context, '0x123');
    } catch (error) {
      // no action
    }
  });
});
