import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { textToHex, textToBytesLength } from '@utils/index';
import {
  hexToBytes,
  privateKeyToPublicKey,
  pubkeyToAddress,
  blake160,
  utf8ToBytes,
  bytesToHex,
  hexToUtf8,
} from '@nervosnetwork/ckb-sdk-utils';
import { getUnspentCells } from '@src/utils/apis';
import { createRawTxUpdateData } from '../txGenerator';
import { configService } from '../../../config';
import { bobAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

describe('Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('createRawTx test secp256k1', async () => {
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
    console.log('--- unspentCells ---', JSON.stringify(unspentCells));

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
    console.log('--- signObj ---', JSON.stringify(signObj));
    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
