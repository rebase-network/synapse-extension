import { DepType, ScriptHashType } from '@keyper/specs';
import CKB from '@nervosnetwork/ckb-sdk-core';
import LOCKS_INFO from '@common/utils/constants/locksInfo';
import { TypesInfo } from '@common/utils/constants/typesInfo';

const { codeHash: anyPayCodeHash, txHash: anypayTxHash } = LOCKS_INFO.testnet.anypay;

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('SimpleUDT Test', () => {
  const address =
    'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhp09gqw99tkwn6mpf7vhktevyrulcy9xw82pdvd';
  const txHash = {
    version: '0x0',
    cellDeps: [
      {
        depType: 'depGroup',
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
      },
      {
        depType: 'code',
        outPoint: {
          txHash: '0xa18868d6dc6bd7b1a40a515dd801709baec6f64fdf9455e3f9f4c6393b9e8477',
          index: '0x0',
        },
      },
    ],
    headerDeps: [],
    inputs: [
      {
        since: '0x0',
        previousOutput: {
          txHash: '0xc77b6f88fa01e90fd9fa099c80b6ae8ab149aeb630026d9d777e409c0b0f15af',
          index: '0x1',
        },
      },
    ],
    outputs: [
      {
        capacity: '0x4a817c800',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
        },
        type: {
          hashType: TypesInfo.testnet.simpleudt.hashType,
          codeHash: TypesInfo.testnet.simpleudt.codeHash,
          args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
        },
      },
      {
        capacity: '0x5d21dba000',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
        },
        type: null,
      },
    ],
    outputsData: ['0x40420f00000000000000000000000000', '0x'],
    witnesses: [
      '0x5500000010000000550000005500000041000000422cf6ebf18e2e22a8b8f86f6ee499ec2f0e1ece1c30bdf6c3cd8eb976ae6102131f10a939855bfa2424e82b81d5ff34452e75eb6bd9a8f2f3ed81d892a0a7bd00',
    ],
  };

  it('mint SimpleUDT', async () => {
    jest.setTimeout(5000);
    // const args = `0x${ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(sk1), 'hex')}`;
    const nodeUrl = 'https://testnet.getsynapse.io/rpc'; // example node url
    const ckb = new CKB(nodeUrl); // instantiate the JS SDK with provided node url
    const privateKey = '0x70e5d3e37691c8f0b3977044ea910ad09fa3ae651bcd15d07d8ab7ad49373f22';

    const mintUDTTransaction = {
      version: '0x0',
      cellDeps: [
        {
          depType: 'depGroup' as DepType,
          outPoint: {
            txHash: anypayTxHash,
            index: '0x0',
          },
        },
        {
          depType: 'code' as DepType,
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
        },
      ],
      headerDeps: [],
      inputs: [
        {
          since: '0x0',
          previousOutput: {
            txHash: '0x34cbd1d17e9364314fb42c754a6b39b4fd2350fbe920faeaa99cfa9e6a1bfc39',
            index: '0x0',
          },
        },
      ],
      outputs: [
        {
          capacity: '0x4a817c800',
          lock: {
            hashType: 'type' as ScriptHashType,
            codeHash: anyPayCodeHash,
            args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
          },
        },
      ],
      outputsData: ['0x40420f00000000000000000000000000'],
      witnesses: [
        {
          lock: '',
          inputType: '',
          outputType: '',
        },
      ],
    };
    // const signedTx = await ckb.signTransaction(privateKey)(mintUDTTransaction, []);
    // console.log(/signedTx/, signedTx);
    // const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    // console.log(/realTxHash/, JSON.stringify(realTxHash));
    // console.log(`The real transaction hash is: ${realTxHash}`);
    // 0x118305db8ce3b1879c6f058e045ab0d91e1eb9c4b5ed5ccc36aeb49aac8f27fa
  });
});
