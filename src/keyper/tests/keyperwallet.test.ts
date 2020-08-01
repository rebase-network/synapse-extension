import { aliceAddresses, aliceWallet, aliceWalletPwd } from '@src/test/fixture/address';
import setupKeyper from '@src/keyper/setupKeyper';
import { privateKey, rawTx, signedMessage, config } from '@common/fixtures/tx';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';

describe('Transaction test: secp256k1', () => {
  const {
    publicKey,
    secp256k1: { lock: lockHash },
  } = aliceAddresses;
  it('should be able to sign tx with secp256k1', async () => {
    await NetworkManager.createNetwork({
      title: 'Aggron Testnet',
      networkType: 'testnet',
      prefix: 'ckt',
      nodeURL: 'http://testnet.getsynapse.io/rpc',
      cacheURL: 'http://testnet.getsynapse.io/api',
    });
    await NetworkManager.createNetwork({
      title: 'Lina Mainnet',
      networkType: 'mainnet',
      prefix: 'ckb',
      nodeURL: 'http://mainnet.getsynapse.io/rpc',
      cacheURL: 'http://mainnet.getsynapse.io/api',
    });

    await browser.storage.local.set({
      publicKeys: [publicKey],
      wallets: [aliceWallet],
    });
    const { publicKeys, wallets } = await browser.storage.local.get(['publicKeys', 'wallets']);

    expect(publicKeys[0]).toEqual(publicKey);
    expect(wallets[0]).toEqual(aliceWallet);

    await setupKeyper();

    const signedTx = await signTx(lockHash, aliceWalletPwd, rawTx, config, {
      privateKey,
    });

    const { witnesses } = signedTx;

    expect(witnesses[3]).toEqual(signedMessage);
  });
});
