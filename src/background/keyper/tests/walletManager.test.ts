import wallets from '@src/wallet/fixtures/wallets';
import WalletManager from '../walletManager';

describe('wallet manager', () => {
  const manager = WalletManager.getInstance();
  const publicKeys = wallets.map((wallet) => wallet.publicKey);

  it('should able to get all public keys', async () => {
    await browser.storage.local.set({
      publicKeys,
    });

    const itsPublicKeys = await manager.getAllPublicKeys();
    expect(itsPublicKeys).toEqual(publicKeys);
    expect(itsPublicKeys).toHaveLength(3);
  });
});
