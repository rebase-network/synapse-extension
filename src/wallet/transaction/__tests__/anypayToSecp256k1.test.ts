import { BN } from 'bn.js';
import { createRawTx } from '../txGenerator';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
const CKB = require('@nervosnetwork/ckb-sdk-core').default;

import { bobAddresses, aliceAddresses } from '../../../test/fixture/address';
import { anypayDep } from '../../../test/fixture/deps';

describe('Transaction test', () => {
  const ckb = new CKB('http://101.200.147.143:8117/rpc');

  it('send transaction from anypay to secp256k1', async () => {
    const privateKey = bobAddresses.privateKey;
    const fromAddress = bobAddresses.anyPay.address;
    const toAddress = aliceAddresses.secp256k1.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);
    const totalConsumed = toAmount.add(fee);

    const deps = [anypayDep];
    const lockHash = bobAddresses.anyPay.lock;
    const unspentCells = await getUnspentCells(lockHash);

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, fee);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
