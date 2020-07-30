import {
  calculateSerializedTxSizeInBlock,
  calculateTransactionFee,
} from '@nervosnetwork/ckb-sdk-utils';
import { BN } from 'bn.js';
import { MIN_FEE_RATE, EMPTY_WITNESS } from '@src/utils/constants';

const calculateTxFee = (transaction, feeRate = BigInt(1000)) => {
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
  if (BigInt(txFee) < BigInt(MIN_FEE_RATE)) {
    console.log(/calculate fee/, txFee);
    console.log(/min_fee_rate/, MIN_FEE_RATE);
    txFee = MIN_FEE_RATE;
  }
  const chargeOutput = outputs[1];
  const chargeCapacity = BigInt(chargeOutput.capacity) - BigInt(txFee);
  chargeOutput.capacity = `0x${new BN(chargeCapacity).toString(16)}`;
  const returnTx = {
    version,
    cellDeps,
    headerDeps,
    inputs,
    outputs,
    outputsData,
    witnesses,
  };
  outputs[1] = chargeOutput;
  return returnTx;
};

export default calculateTxFee;

// class CalculateFee {
//   public feeRate: bigint;

//   public fee: bigint;

//   public transaction: CKBComponents.Transaction;

//   constructor(feeRate: bigint, transaction: CKBComponents.Transaction) {
//     this.feeRate = feeRate;
//     this.transaction = transaction;
//   }

//   async calculateTxFee(transaction: CKBComponents.Transaction, feeRate = BigInt(1000)) {
//     const returnTx = transaction;
//     const transactionSize = calculateSerializedTxSizeInBlock(transaction);
//     const txFee = calculateTransactionFee(BigInt(transactionSize), feeRate);

//     const { outputs } = transaction;
//     const chargeOutput = outputs[1];
//     const chargeCapacity = BigInt(chargeOutput.capacity) - this.fee;
//     chargeOutput.capacity = chargeCapacity.toString();
//     returnTx.outputs[1] = chargeOutput;
//     return returnTx;
//     // return this.calculateTxFee(transaction, BigInt(txFee));
//   }
// }

// module.exports = CalculateFee;
