import _ from 'lodash';
import {
  aliceAddresses,
  aliceWallet,
  aliceWalletPwd,
  aliceWalletInStorage,
  bobAddresses,
} from '@src/tests/fixture/address';
import setupKeyper from '@background/keyper/setupKeyper';
import { privateKey, rawTx, signedMessage, config } from '@common/fixtures/tx';
import {
  signTx,
  getWallets,
  addKeyperWallet,
  addWallet,
  getPublicKeys,
  addPublicKey,
  setCurrentWallet,
  getCurrentWallet,
  setAddressesList,
  getAddressList,
} from '@background/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { networks } from '@src/common/utils/constants/networks';
import addressesList from './fixtures/addressesList';

jest.mock('@background/wallet/passwordEncryptor');

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

  it('should able to get wallets', async () => {
    const wallets = await getWallets();
    expect(wallets).toEqual([aliceWallet]);
  });

  it('should able to addKeyperWallet', async () => {
    await addKeyperWallet(aliceAddresses.privateKey.substr(2), aliceWalletPwd);
    const wallets = await getWallets();
    expect(wallets).not.toBeNull();
  });

  it('should able to addWallet', async () => {
    await addWallet(
      aliceAddresses.privateKey.substr(2),
      aliceWallet.keystore,
      aliceWallet.entropyKeystore,
      aliceWallet.rootKeystore,
    );
    const wallets = await getWallets();
    expect(wallets[wallets.length - 1]).toEqual(aliceWallet);
  });

  it('should able to addPublicKey', async () => {
    await addPublicKey(aliceAddresses.publicKey);
    const publicKeys = await getPublicKeys();
    expect(publicKeys).toEqual([aliceAddresses.publicKey]);
    await addPublicKey(bobAddresses.publicKey);
    const publicKeysAfter = await getPublicKeys();
    expect(publicKeysAfter).toEqual([aliceAddresses.publicKey, bobAddresses.publicKey]);
  });

  it('should able to setCurrentWallet', async () => {
    await setCurrentWallet(aliceWallet.publicKey);
    const currentWallet = await getCurrentWallet();
    expect(currentWallet).toEqual(aliceWalletInStorage);
  });

  it('should able to setAddressesList', async () => {
    await setAddressesList(addressesList);
    const { addressesList: list } = await browser.storage.local.get('addressesList');
    expect(list).toEqual(addressesList);
  });

  it('should able to getAddressList', async () => {
    const list = await getAddressList();
    expect(list).not.toBeNull();
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
