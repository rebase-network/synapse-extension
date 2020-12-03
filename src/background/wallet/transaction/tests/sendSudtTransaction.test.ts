import { rawTx } from '@common/fixtures/tx';
import NetworkManager from '@src/common/networkManager';
import setupKeyper from '@background/keyper/setupKeyper';
import {
  aliceAddresses,
  aliceWallet,
  aliceWalletPwd,
  aliceWalletInStorage,
  bobAddresses,
} from '@src/tests/fixture/address';
import {
  createSudtTransaction,
  signSudtTransaction,
  sendSudtTransaction,
} from '../sendSudtTransaction';

const fixtures = require('./sUdtSend.fixtures.json');

jest.mock('@common/utils/apis');
// jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('SUDT Transaction test', () => {
  const { publicKey } = aliceAddresses;

  beforeAll(async () => {
    await NetworkManager.initNetworks();

    await browser.storage.local.set({
      publicKeys: [publicKey],
      wallets: [aliceWallet],
    });

    await setupKeyper();
  });

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

  it('sign sudt tx with errCode', async () => {
    const { lockHash, password } = fixtures.createMutiAllTo;
    const rawTx = {
      errCode: 1,
    };
    const result = await signSudtTransaction(lockHash, password, rawTx);
    expect(result).toEqual(rawTx);
  });

  // it('sendSudtTransaction', async () => {
  //   const {
  //     fromAddress,
  //     fromLockType,
  //     lockHash,
  //     typeHash,
  //     toAddress,
  //     sendSudtAmount,
  //     fee,
  //     expectSignedTx,
  //     password,
  //   } = fixtures.createMutiAllTo;

  //   const txResultObj = await sendSudtTransaction(
  //     aliceAddresses.secp256k1.address,
  //     fromLockType,
  //     aliceAddresses.secp256k1.lock,
  //     typeHash,
  //     toAddress,
  //     sendSudtAmount,
  //     fee,
  //     aliceWalletPwd,
  //   );

  //   // const txResultObj = await sendSudtTransaction(
  //   //   fromAddress,
  //   //   fromLockType,
  //   //   lockHash,
  //   //   typeHash,
  //   //   toAddress,
  //   //   sendSudtAmount,
  //   //   fee,
  //   //   password,
  //   // );
  //   expect(txResultObj).toEqual(expectSignedTx);
  // });
  it('send Muti SUDT All to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
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
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });

  it('send Muti SUDT Part to ...', async () => {
    const {
      fromAddress,
      fromLockType,
      lockHash,
      typeHash,
      toAddress,
      sendSudtAmount,
      fee,
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
    );
    expect(signedTx.tx).toEqual(expectSignedTx);
  });
});
