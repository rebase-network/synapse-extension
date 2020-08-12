import NetworkManager from '@src/common/networkManager';
import { createSudtTransaction } from '../sendSudtTransaction';

const fixtures = require('./sUdtSend.fixtures.json');

jest.unmock('@utils/apis');
jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('SUDT Transaction test', () => {
  beforeEach(async () => {
    await NetworkManager.initNetworks();
    const testNet = {
      title: 'Aggron Testnet',
      networkType: 'testnet',
      prefix: 'ckt',
      nodeURL: 'https://testnet.getsynapse.io/rpc',
      cacheURL: 'https://testnet.getsynapse.io/api',
    };
    await browser.storage.local.set({ currentNetwork: testNet });
  });

  it('send Muti SUDT All to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
      expectSignedTx,
    } = fixtures.createMutiAllTo;

    const signedTx = await createSudtTransaction(
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });

  it('send Muti SUDT Part to ...', async () => {
    jest.setTimeout(50000);

    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
      expectSignedTx,
    } = fixtures.createMutiPartTo;

    const signedTx = await createSudtTransaction(
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });

  it('send single SUDT All to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
      expectSignedTx,
    } = fixtures.createSingleAllTo;

    const signedTx = await createSudtTransaction(
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });

  it('send single SUDT Part to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
      expectSignedTx,
    } = fixtures.createSinglePartTo;

    const signedTx = await createSudtTransaction(
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });

  it('send single SUDT Part to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
      expectSignedTx,
    } = fixtures.createSinglePartToError;

    const signedTx = await createSudtTransaction(
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
      password,
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });
});
