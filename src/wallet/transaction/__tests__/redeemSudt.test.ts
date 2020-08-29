import CKB from '@nervosnetwork/ckb-sdk-core';
import NetworkManager from '@src/common/networkManager';
import { redeemSudtTx } from '../redeemSudtTransaction';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Mint SimpleUDT Test', () => {
  const privateKey1 = '0xdde136f5c95a2f37cb1480c3bc3d9f18b49225fc8449e5a16a853fc0a7d4efaa'; // viable cash popular certain index joke pet picnic ridge good industry dream
  const address1 = 'ckt1qyqwtq7qhg6j9hfqxnndmxyzmlamn85dhs7sjn8rsl';

  const nodeUrl = 'https://testnet.getsynapse.io/rpc'; // example node url
  const ckb = new CKB(nodeUrl); // instantiate the JS SDK with provided node url

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

  it('redeem SimpleUDT from  address1 to address1', async () => {
    jest.setTimeout(50000);

    const fromAddress = address1;
    const redeemSudtAmount = 1;
    const fee = 10000;

    const rawTxObj = await redeemSudtTx(fromAddress, redeemSudtAmount, fee);
    const rawTx = rawTxObj.tx;
    console.log(/rawTxObj/, JSON.stringify(rawTx));

    const signedTx = await ckb.signTransaction(privateKey1)(rawTx, []);

    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log(`The real transaction hash is: ${realTxHash}`);
    // 0x5158c78215a0dbedeeb3e729680ab8c0d8f9991c56f6c1c9a669d730aa2ced1f
  });
});
