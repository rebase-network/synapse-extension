import { getWalletsInStorage } from '../addKeyperWallet';
import { wallets as walletsSample } from '../fixtures/wallets';

describe('add keyper wallet', () => {
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
