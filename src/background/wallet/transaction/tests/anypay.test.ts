import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';
import { bobAddresses, aliceAddresses } from '@src/tests/fixture/address';
import { createRawTx, createAnyPayRawTx } from '../txGenerator';
import unspentCells from './fixtures/cells';

const anypayDep = {
  outPoint: {
    txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
    index: '0x0',
  },
  depType: 'depGroup',
};

jest.mock('@common/utils/apis');

describe('Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('createRawTx test anyonepay', async () => {
    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.anyPay.address;
    const toAddress = aliceAddresses.anyPay.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);

    const deps = [anypayDep];

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, fee);

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx, []);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    expect(realTxHash).toEqual('0x123');
  });

  it('createAnyPayRawTx test anyonepay', async () => {
    const fromAddress = bobAddresses.anyPay.address;
    const toAddress = aliceAddresses.anyPay.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);

    const deps = [anypayDep];

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const anyPayRawTx = createAnyPayRawTx(
      toAmount,
      toLock,
      cells,
      lock,
      deps,
      fee,
      cells,
      totalCapity,
    );
    const expected = {
      fee: '05f5e100',
      target: '0x6af8c2199802665ea2a8ed85b087b1ac26b47b332dfe7322c6b34e38f1a2f129',
      tx: {
        cellDeps: [
          {
            depType: 'depGroup',
            outPoint: {
              index: '0x0',
              txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
            },
          },
        ],
        headerDeps: [],
        inputs: [
          {
            previousOutput: {
              index: '0x1',
              txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            },
            since: '0x0',
          },
        ],
        outputs: [
          {
            capacity: '0x5e3ff5d00',
            lock: {
              args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
              codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
              hashType: 'type',
            },
          },
        ],
        outputsData: ['0x'],
        version: '0x0',
        witnesses: ['0x', { inputType: '', lock: '', outputType: '' }],
      },
    };
    expect(anyPayRawTx.tx).toEqual(expected.tx);
  });
});
