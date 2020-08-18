import CKB from '@nervosnetwork/ckb-sdk-core';
import { BN } from 'bn.js';
import { toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils';
import { parseSUDT } from '@src/utils';
import { ckbToshannonFormatter } from '@src/utils/formatters';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Transaction test', () => {
  //   const ckb = new CKB('https://testnet.getsynapse.io/rpc');

  //   it('test getTransaction', async () => {
  //     const txHash = '0x118305db8ce3b1879c6f058e045ab0d91e1eb9c4b5ed5ccc36aeb49aac8f27fa';
  //     const tx = await ckb.rpc.getTransaction(txHash);
  //     console.log(/tx/, JSON.stringify(tx));
  //     const { outputs } = tx.transaction;
  //   });

  it('test capacity value', () => {
    // const toSudtAmount = 142 * 10 ** 8;
    // const capacity = `0x${new BN(toSudtAmount).toString(16)}`;
    // console.log(capacity);
    // // const liend = toHexInLittleEndian(BigInt(toSudtAmount), 16);
    // // console.log(liend);
    // // const intValue = parseSUDT(liend);
    // // console.log(intValue);
    const capacity = '0.0003';
    const result = ckbToshannonFormatter(Number(capacity));
    console.log(result);
  });
});
