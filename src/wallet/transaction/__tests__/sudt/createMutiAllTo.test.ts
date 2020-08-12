import NetworkManager from '@src/common/networkManager';
import { createSudtTransaction } from '../../sendSudtTransaction';
import {
  fromAddress,
  fromLockType,
  lockHash,
  typeHash,
  toAddress,
  sendSudtAmount,
  fee,
  password,
  expectSignedTx,
} from '../data/createMutiAllTo';

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
