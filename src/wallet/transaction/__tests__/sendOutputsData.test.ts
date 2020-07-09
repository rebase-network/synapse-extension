import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import * as utils from '@nervosnetwork/ckb-sdk-utils/lib';
import { textToHex } from '@utils/index';
import { getUnspentCells } from '@utils/apis';
import CKB from '@nervosnetwork/ckb-sdk-core';
import configService from '@src/config';
import { createRawTx } from '../txGenerator';
import { bobAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

jest.mock('@utils/apis');

describe('Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('createRawTx test secp256k1', async () => {
    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.secp256k1.address;
    const toAddress = bobAddresses.secp256k1.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const fee = new BN(100000000);
    const toData = 'synapse'; // 0x73796e61707365
    const toDataHex = textToHex(toData);
    const bytes = utils.hexToBytes(toDataHex);
    const { byteLength } = bytes;
    let toAmount = new BN(byteLength * 100000000);
    toAmount = toAmount.add(new BN('6100000000'));

    const deps = [secp256k1Dep];

    const lockHash = bobAddresses.secp256k1.lock;
    const params = {
      capacity: toAmount,
    };
    const unspentCells = await getUnspentCells(lockHash, params);
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, fee, toDataHex);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx, []);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
