import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import CKB from '@nervosnetwork/ckb-sdk-core';
import { createRawTxDeleteData } from '../txGenerator';
import { configService } from '../../../config';
import { bobAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

describe('Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('createRawTx test secp256k1', async () => {
    const deps = [secp256k1Dep];

    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.secp256k1.address;
    const fromLockScript = addressToScript(fromAddress);
    const fee = new BN(100000000);

    const txHash = '0x7f5420f202cacf4335c9dcb22fb7b0136e43cb09ec4d9f4e7626f6dab88b56e3';
    const index = '0x0';
    const inputOutPoint: CKBComponents.OutPoint = {
      txHash,
      index,
    };
    const liveCellResult = await ckb.rpc.getLiveCell(inputOutPoint, true);
    // --- liveCellResult --- {
    //     cell: {
    //       data: {
    //         content: '0x73796e61707365',
    //         hash: '0xf276b360de7dc210833e8efb1f19927ecd8ff89e94c72d29dc20813fe8368564'
    //       },
    //       output: { lock: [Object], type: null, capacity: '0x1954fc400' }
    //     },
    //     status: 'live'
    //   }
    const dataCapacity = BigInt(liveCellResult.cell.output.capacity);

    const signObj = createRawTxDeleteData(
      fromLockScript,
      inputOutPoint,
      new BN(dataCapacity),
      deps,
      fee,
    );
    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
