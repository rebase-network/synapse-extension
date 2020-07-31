import { wallets as walletsSample } from '@src/wallet/fixtures/wallets';
import { getWalletsInStorage } from './secp256k1';

describe('secp256k1 sign provider', () => {
  it('should be able to set wallets to storage', async () => {
    const { wallets } = await browser.storage.local.get('wallets');

    expect(wallets).toBeUndefined();

    await browser.storage.local.set({
      wallets: walletsSample,
    });
    const newWallets = await getWalletsInStorage();

    expect(newWallets).toEqual(walletsSample);
  });
});
