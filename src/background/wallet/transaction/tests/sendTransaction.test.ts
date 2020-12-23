import NetworkManager from '@common/networkManager';
import setupKeyper from '@background/keyper/setupKeyper';
import { networks } from '@src/common/utils/constants/networks';
import { aliceAddresses, aliceWallet } from '@src/tests/fixture/address';
import {
  generateTx,
  generateAnyPayTx,
  sendTransaction,
  genDummyTransaction,
} from '../sendTransaction';

import {
  generateTxFixture,
  generateKeccakTxFixture,
  generateAnyPayTxFixture,
  sendTransactionFixture,
  genDummyTransactionFixture,
} from './fixtures/sendTransaction';

jest.mock('@src/common/utils/apis');
jest.mock('@background/keyper/signProviders/secp256k1WithPrivateKey');

describe('send transaction', () => {
  const { publicKey } = aliceAddresses;

  beforeAll(async () => {
    await NetworkManager.initNetworks();
    await NetworkManager.setCurrentNetwork(networks[1].title);

    await browser.storage.local.set({
      publicKeys: [publicKey],
      wallets: [aliceWallet],
    });

    await setupKeyper();
  });

  it('generateTx from secp256k1 to secp256k1', async () => {
    const [
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    ] = generateTxFixture.params;
    const result = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
    expect(result.tx).toEqual(generateTxFixture.expected);
  });

  it('generateTx from secp256k1 to keccak', async () => {
    const [
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    ] = generateKeccakTxFixture.params;
    const result = await generateTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toDataHex,
    );
    expect(result.tx).toEqual(generateKeccakTxFixture.expected);
  });

  it('generateAnyPayTx', async () => {
    const [
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      fromLockType,
      toLockType,
    ] = generateAnyPayTxFixture.params;
    const result = await generateAnyPayTx(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      fromLockType,
      toLockType,
    );
    expect(result.tx).toEqual(generateAnyPayTxFixture.expected);
  });

  it('sendTransaction', async () => {
    const [
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      password,
      toData,
    ] = sendTransactionFixture.params;
    const result = await sendTransaction(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      password,
      toData,
    );
    expect(result.txHash).toEqual(sendTransactionFixture.expected.txHash);
  });

  it('genDummyTransaction', async () => {
    const [
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toData,
    ] = genDummyTransactionFixture.params;
    const result = await genDummyTransaction(
      fromAddress,
      toAddress,
      toAmount,
      fee,
      lockHash,
      lockType,
      toData,
    );
    expect(result).toEqual(genDummyTransactionFixture.expected);
  });
});
