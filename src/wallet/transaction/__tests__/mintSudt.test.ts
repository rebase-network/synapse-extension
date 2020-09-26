import CKB from '@nervosnetwork/ckb-sdk-core';
import NetworkManager from '@src/common/networkManager';
import { CKB_TOKEN_DECIMALS } from '@src/utils/constants';
import { createSudtTransaction } from '../mintSudtTransaction';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Mint SimpleUDT Test', () => {
  const privateKey1 = '0xdde136f5c95a2f37cb1480c3bc3d9f18b49225fc8449e5a16a853fc0a7d4efaa'; // viable cash popular certain index joke pet picnic ridge good industry dream
  const address1 = 'ckt1qyqwtq7qhg6j9hfqxnndmxyzmlamn85dhs7sjn8rsl';

  const privateKey2 = '0xd3f8f72ae675314cb2e5ed1f343318ae069544015c6ee9f0f1fe1dd1af8180af'; // forest radar cheap sure method undo potato squeeze jaguar right dismiss call
  const address2 = 'ckt1qyqqeemf67thft9m59qkp7qzp9m0agt2l76s9mpfz0';

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

  it('mint SimpleUDT from  address1 to address1', async () => {
    jest.setTimeout(5000);
    const fromAddress = address1;
    const toAddress = address1;
    const mintSudtAmount = 100 * CKB_TOKEN_DECIMALS;
    const fee = 10000;
    const rawTxObj = await createSudtTransaction(fromAddress, toAddress, mintSudtAmount, fee);
    const rawTx = rawTxObj.tx;
    console.log(/rawTxObj/, JSON.stringify(rawTx));

    const signedTx = await ckb.signTransaction(privateKey1)(rawTx, []);

    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log(`The real transaction hash is: ${realTxHash}`);
    // First : 0x67c24010986a26df7094308d06d5c0ed135f230a309ef78b1446c75d2b6500e5
    // Second: 0xda41e25d6946605a2d793b08e98bd0b62399b5969f2a2876a35e51cf29a8190b
  });

  it.skip('mint SimpleUDT from  address2 to address1', async () => {
    jest.setTimeout(5000);
    const fromAddress = address2;
    const toAddress = address1; // address1定义了SUDT的类型:
    const mintSudtAmount = 999999999900;
    const fee = 10000;
    const rawTxObj = await createSudtTransaction(fromAddress, toAddress, mintSudtAmount, fee);
    const rawTx = rawTxObj.tx;
    console.log(/rawTxObj/, JSON.stringify(rawTx));

    const signedTx = await ckb.signTransaction(privateKey1)(rawTx, []);

    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log(`The real transaction hash is: ${realTxHash}`);
  });
});
