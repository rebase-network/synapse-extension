import CKB from '@nervosnetwork/ckb-sdk-core';
import NetworkManager from '@src/common/networkManager';
import { ScriptHashType } from '@keyper/specs/types/type';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils';
import { redeemSudtTx } from '../redeemSudtTransaction';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Mint SimpleUDT Test', () => {
  const privateKey1 = '0xdde136f5c95a2f37cb1480c3bc3d9f18b49225fc8449e5a16a853fc0a7d4efaa'; // viable cash popular certain index joke pet picnic ridge good industry dream
  const address1 = 'ckt1qyqwtq7qhg6j9hfqxnndmxyzmlamn85dhs7sjn8rsl';

  const privateKey2 = '0xd3f8f72ae675314cb2e5ed1f343318ae069544015c6ee9f0f1fe1dd1af8180af'; // forest radar cheap sure method undo potato squeeze jaguar right dismiss call
  const address2 = 'ckt1qyqqeemf67thft9m59qkp7qzp9m0agt2l76s9mpfz0';

  const privateKey3 = '0xa02c4ec3735491a5939de90ef1b7bdd13c7ef14c4ec4b03041495490bead75a0'; // object decline rigid earth marriage rather drip purse february coyote never what
  const address3 = 'ckt1qyqyxq9f2c5975v3kj4w64p0sfsv4l4maelsnm64w7';

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
    const toAddress = address1; // address1定义了SUDT的类型:
    const redeemSudtAmount = 100;
    const fee = 10000;
    const toLockHash = '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e';
    const typeScript = {
      hashType: 'data' as ScriptHashType,
      codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
      args: toLockHash,
    };
    const typeHash = scriptToHash(typeScript);
    const rawTxObj = await redeemSudtTx(fromAddress, toAddress, redeemSudtAmount, fee, typeHash);
    const rawTx = rawTxObj.tx;
    console.log(/rawTxObj/, JSON.stringify(rawTx));

    const signedTx = await ckb.signTransaction(privateKey1)(rawTx, []);

    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log(`The real transaction hash is: ${realTxHash}`);
    // 0x5158c78215a0dbedeeb3e729680ab8c0d8f9991c56f6c1c9a669d730aa2ced1f
  });
});
