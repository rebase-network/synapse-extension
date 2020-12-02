import _ from 'lodash';
import { aliceAddresses, aliceWallet, aliceWalletPwd } from '@src/test/fixture/address';
import setupKeyper from '@src/keyper/setupKeyper';
import { privateKey, rawTx, signedMessage, config } from '@common/fixtures/tx';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { networks } from '@utils/constants/networks';

describe('Transaction test: secp256k1', () => {
  const {
    publicKey,
    secp256k1: { lock: lockHash },
  } = aliceAddresses;

  beforeAll(async () => {
    await NetworkManager.initNetworks();

    await browser.storage.local.set({
      publicKeys: [publicKey],
      wallets: [aliceWallet],
    });

    await setupKeyper();
  });

  it('Mainnet: should be able to sign tx with secp256k1', async () => {
    const { publicKeys, wallets } = await browser.storage.local.get(['publicKeys', 'wallets']);
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    const rawTxCloned = _.cloneDeep(rawTx);
    const signedMessageMainnet =
      '0x5500000010000000550000005500000041000000fa97259d2e457f6a4f84a7cb92940062df8c6ba1a63bd32784e462c59b76abcc35bc4e12fba5caf87ef7eb39b402fad6b272c7546ffd126ea2445d2c8e51f0bb00';

    expect(publicKeys[0]).toEqual(publicKey);
    expect(wallets[0]).toEqual(aliceWallet);
    expect(currentNetwork.networkType).toEqual('mainnet');

    const signedTx = await signTx(lockHash, aliceWalletPwd, rawTxCloned, config, {
      privateKey,
    });

    const { witnesses } = signedTx;

    witnesses[3] = signedMessageMainnet;

    const expectedSignTx = {
      ...rawTxCloned,
      witnesses,
    };

    expect(signedTx).toEqual(expectedSignTx);
    expect(witnesses[3]).toEqual(signedMessageMainnet);
  });

  it('Testnet: should be able to sign tx with secp256k1', async () => {
    const { publicKeys, wallets } = await browser.storage.local.get(['publicKeys', 'wallets']);
    const currentNetwork = await NetworkManager.getCurrentNetwork();
    const rawTxCloned = _.cloneDeep(rawTx);

    expect(publicKeys[0]).toEqual(publicKey);
    expect(wallets[0]).toEqual(aliceWallet);
    expect(currentNetwork.networkType).toEqual('mainnet');

    await NetworkManager.setCurrentNetwork(networks[1].title);

    const currentNetworkAfter = await NetworkManager.getCurrentNetwork();

    expect(currentNetworkAfter.networkType).toEqual('testnet');

    const signedTx = await signTx(lockHash, aliceWalletPwd, rawTxCloned, config, {
      privateKey,
    });

    const { witnesses } = signedTx;

    const expectedSignTx = {
      ...rawTxCloned,
      witnesses,
    };

    expect(signedTx).toEqual(expectedSignTx);
    expect(witnesses[3]).toEqual(signedMessage);
  });
});
