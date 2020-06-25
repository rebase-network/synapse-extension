import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { textToHex, textToBytesLength } from '@utils/index';
import { getUnspentCells } from '@src/utils/apis';
import _ from 'lodash';
import CKB from '@nervosnetwork/ckb-sdk-core';
import { createRawTxUpdateData, createUpdateDataRawTx } from '../txGenerator';
import { configService } from '../../../config';
import { bobAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

describe('send Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it.skip('update output data ', async () => {
    const deps = [secp256k1Dep];

    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.secp256k1.address;
    const lockHash = bobAddresses.secp256k1.lock;

    const fromLockScript = addressToScript(fromAddress);
    const fee = new BN(100000000);

    const newInputData = 'hello Rebase Synapse';
    const newInputDataHex = textToHex(newInputData);
    const newInputDataLength = textToBytesLength(newInputData);
    const newDataCapacity = newInputDataLength * 10 ** 8;

    const txHash = '0x38d72c557463f6aae63d2c82954157ed17b959f092b1604f8b71ef2174eb922e';
    const index = '0x0';
    const inputOutPoint: CKBComponents.OutPoint = {
      txHash,
      index,
    };
    const liveDataCellResult = await ckb.rpc.getLiveCell(inputOutPoint, true);
    const cellDataCapacity = BigInt(liveDataCellResult.cell.output.capacity);
    const oldDataCapacity = cellDataCapacity - BigInt(61 * 10 ** 8);

    // Free cells
    const unspentCells = await getUnspentCells(lockHash);

    const signObj = createRawTxUpdateData(
      deps,
      BigInt(fee),
      fromLockScript,
      inputOutPoint,
      BigInt(cellDataCapacity),
      BigInt(oldDataCapacity),
      BigInt(newDataCapacity),
      newInputDataHex,
      unspentCells,
    );
    const signedTx = ckb.signTransaction(privateKey)(signObj.tx, []);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });

  it('update output data ', async () => {
    const deps = [secp256k1Dep];

    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.secp256k1.address;
    const lockHash = bobAddresses.secp256k1.lock;

    const fromLockScript = addressToScript(fromAddress);
    const fee = new BN(100000000);

    const newInputData = '';
    let newInputDataHex = '';
    let newInputDataLength = 0;
    let newDataCapacity = 0;
    if (_.isEmpty(newInputData)) {
      newInputDataHex = '0x';
    } else {
      newInputDataHex = textToHex(newInputData);
      newInputDataLength = textToBytesLength(newInputData);
      newDataCapacity = newInputDataLength * 10 ** 8;
    }

    const txHash = '0x8417994002be9419bb8c9ff5af70b2558ee3328d903e6a8ea77729937d37124f';
    const index = '0x0';
    const inputOutPoint: CKBComponents.OutPoint = {
      txHash,
      index,
    };
    const liveDataCellResult = await ckb.rpc.getLiveCell(inputOutPoint, true);
    const cellDataCapacity = BigInt(liveDataCellResult.cell.output.capacity);

    // Free cells
    const unspentCells = await getUnspentCells(lockHash);

    const signObj = createUpdateDataRawTx(
      deps,
      BigInt(fee),
      fromLockScript,
      inputOutPoint,
      BigInt(cellDataCapacity),
      unspentCells,
      BigInt(newDataCapacity),
      newInputDataHex,
    );
    const signedTx = ckb.signTransaction(privateKey)(signObj.tx, []);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});

// 1- 0x38d72c557463f6aae63d2c82954157ed17b959f092b1604f8b71ef2174eb922e
// 2- 0xacfc6eb21764c8e3189c20fe389442d0b56ef8bc810bc702fe2ab1ebee616034
