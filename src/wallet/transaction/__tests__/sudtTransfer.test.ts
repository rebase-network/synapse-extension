import CKB from '@nervosnetwork/ckb-sdk-core';
import * as utils from '@nervosnetwork/ckb-sdk-utils';
import {
  LockScript,
  ScriptHashType,
  DepType,
  Script,
  CellDep,
  SignatureAlgorithm,
  RawTransaction,
  Config,
  SignProvider,
  SignContext,
} from '@keyper/specs';

const numberToBN = require('number-to-bn');

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('SimpleUDT Test', () => {
  it(' Transfer SimpleUDT', async () => {
    jest.setTimeout(5000);
    // const args = `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk1), 'hex')}`;
    const nodeUrl = 'https://testnet.getsynapse.io/rpc'; // example node url
    const ckb = new CKB(nodeUrl); // instantiate the JS SDK with provided node url
    const privateKey = '0x8e37c5553f29a63e38a54f2f28bb921e05f868ec813afbff8f1a5aa92404a777';
    const address =
      'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhk3revrcye0356ns9k5edfzmm0mt53fmk6n77qe';
    const targetCapacity = 575;
    const charge = `0x${targetCapacity.toString(16)}`;
    console.log(/charge/, charge);

    const transferTransaction = {
      version: '0x0',
      cellDeps: [
        {
          depType: 'depGroup' as DepType,
          outPoint: {
            txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
            index: '0x0',
          },
        },
        {
          depType: 'code' as DepType,
          outPoint: {
            txHash: '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958',
            index: '0x0',
          },
        },
      ],
      headerDeps: [],
      inputs: [
        {
          since: '0x0',
          previousOutput: {
            txHash: '0x118305db8ce3b1879c6f058e045ab0d91e1eb9c4b5ed5ccc36aeb49aac8f27fa',
            index: '0x0',
          },
        },
        {
          since: '0x0',
          previousOutput: {
            txHash: '0x7329e30d081812b81ad8f46ecaa47799929aefd18e6fb01b1b8bc050d92b0cae',
            index: '0x0',
          },
        },
      ],
      outputs: [
        {
          capacity: '0x4a817c800',
          lock: {
            hashType: 'type' as ScriptHashType,
            codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
            args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
          },
          type: {
            hashType: 'data' as ScriptHashType,
            codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
            args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type' as ScriptHashType,
            codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
            args: '0xda23cb078265f1a6a702da996a45bdbf6ba453bb',
          },
          type: {
            hashType: 'data' as ScriptHashType,
            codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
            args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
          },
        },
        {
          capacity: '0xd63445f00',
          lock: {
            hashType: 'type' as ScriptHashType,
            codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
            args: '0xda23cb078265f1a6a702da996a45bdbf6ba453bb',
          },
          type: null,
        },
      ],
      outputsData: [
        '0x10270000000000000000000000000000',
        '0x301b0f00000000000000000000000000',
        '0x',
      ],
      witnesses: [
        '0x',
        {
          lock: '',
          inputType: '',
          outputType: '',
        },
      ],
    };
    // const signedTx = await ckb.signTransaction(privateKey)(transferTransaction, []);
    // console.log(/signedTx/, signedTx);
    // const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    // console.log(/realTxHash/, JSON.stringify(realTxHash));
    // console.log(`The real transaction hash is: ${realTxHash}`);
  });
});

// 0x34e62ce00 142 * 10^8
// 0x4a817c800 200 * 10^8
// 0xa0860100000000000000000000000000 = 100K
// 0xa0bb0d00000000000000000000000000 = 900K
// 0x40420f00000000000000000000000000 = 1000000 1m
