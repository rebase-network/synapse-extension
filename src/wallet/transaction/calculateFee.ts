import {
  calculateSerializedTxSizeInBlock,
  calculateTransactionFee,
} from '@nervosnetwork/ckb-sdk-utils';
import { BN } from 'bn.js';
import { MIN_FEE_RATE, EMPTY_WITNESS } from '@src/utils/constants';

export interface CalculateTxFeeResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
}
const calculateTxFee = (transaction, feeRate = BigInt(1000)): CalculateTxFeeResult => {
  const { version, cellDeps, headerDeps, inputs, outputs, outputsData, witnesses } = transaction;

  const calculateTx = {
    version,
    cellDeps,
    headerDeps,
    inputs,
    outputs,
    outputsData,
    witnesses: [EMPTY_WITNESS],
  };
  const transactionSize = calculateSerializedTxSizeInBlock(calculateTx);
  let txFee = calculateTransactionFee(BigInt(transactionSize), feeRate);
  console.log(/feeRate/, feeRate);
  if (BigInt(txFee) < BigInt(MIN_FEE_RATE)) {
    console.log(/calculate fee/, txFee);
    console.log(/min_fee_rate/, MIN_FEE_RATE);
    txFee = MIN_FEE_RATE;
  }
  const chargeOutput = outputs[1];
  const chargeCapacity = BigInt(chargeOutput.capacity) - BigInt(txFee);
  chargeOutput.capacity = `0x${new BN(chargeCapacity).toString(16)}`;
  outputs[1] = chargeOutput;
  const returnTx = {
    version,
    cellDeps,
    headerDeps,
    inputs,
    outputs,
    outputsData,
    witnesses,
  };
  const calculateTxResult = {
    tx: returnTx,
    fee: txFee,
  };
  return calculateTxResult;
};

export default calculateTxFee;
