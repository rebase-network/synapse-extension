import { BN } from 'bn.js';
import { createRawTx } from '../index';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
import { bobAddresses, aliceAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

describe('Transaction test', () => {
  const ckb = new CKB('http://101.200.147.143:8117/rpc');

  it('send transaction from secp256k1 to anypay', async () => {
    const privateKey = bobAddresses.privateKey;
    const fromAddress = bobAddresses.secp256k1.address;
    const toAddress = aliceAddresses.anyPay.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);
    const totalConsumed = toAmount.add(fee);

    const deps = [secp256k1Dep];

    const lockHash = bobAddresses.secp256k1.lock;
    const unspentCells = await getUnspentCells(lockHash);
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, totalConsumed, fee);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
