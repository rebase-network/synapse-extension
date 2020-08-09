import { BN } from 'bn.js';
import { scriptToHash, toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils/lib';
import _ from 'lodash';
import { Cell } from '@nervosnetwork/ckb-sdk-core/lib/generateRawTransaction';
import { SUDT_MIN_AMOUNT } from '../const';
import { ScriptHashType } from '@keyper/specs/types';
import { parseSUDT } from '@src/utils';

export interface CreateRawTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
  target: string;
}

export interface CkbCells {
  cells: Cell[];
  total: any;
}

export function createSudtRawTx(
  sUdtInput: CKBComponents.CellInput,
  sUdtTypeScript: CKBComponents.Script,
  inputCkbCells: CkbCells,
  sUdtOutput: CKBComponents.CellOutput,
  sUdtAmount,
  fromLockScript: CKBComponents.Script,
  sendSudtAmount,
  toLockScript: CKBComponents.Script,
  toSudtOutput: any,
  deps,
  fee,
): CreateRawTxResult {
  const rawTx = {
    version: '0x0',
    cellDeps: deps,
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };
  let config = { index: 0, length: -1 };

  // toSudtOutput
  if (toSudtOutput !== null || toSudtOutput !== undefined) {
    const { outPoint } = toSudtOutput[0];
    const toSudtInput = {
      previousOutput: {
        txHash: outPoint.txHash,
        index: outPoint.index,
      },
      since: '0x0',
    };
    rawTx.inputs.push(toSudtInput);
    rawTx.witnesses.push('0x');
  }

  // 1. input CKB
  for (let i = 0; i < inputCkbCells.cells.length; i++) {
    const element = inputCkbCells.cells[i];
    rawTx.inputs.push({
      previousOutput: element.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }
  if (toSudtOutput !== null || toSudtOutput !== undefined) {
    rawTx.witnesses[1] = {
      lock: '',
      inputType: '',
      outputType: '',
    };
    config = { index: 1, length: 1 };
  } else {
    rawTx.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: '',
    };
  }

  // 2. input Sudt
  rawTx.inputs.push(sUdtInput);
  rawTx.witnesses.push('0x');

  // 1. output transfer to
  // toAddress have the same sudt
  let toSudtOutputCell = null;
  let toSudtCapacity = 0;
  console.log(/toSudtOutput/, toSudtOutput);
  if (toSudtOutput !== null || toSudtOutput !== undefined) {
    const { capacity, lock, type, outputData } = toSudtOutput[0];
    toSudtOutputCell = {
      capacity: capacity,
      lock: {
        hashType: lock.hashType as ScriptHashType,
        codeHash: lock.codeHash,
        args: lock.args,
      },
      type: {
        hashType: type.hashType as ScriptHashType,
        codeHash: type.codeHash,
        args: type.args,
      },
    };
    rawTx.outputs.push(toSudtOutputCell);
    const existSudtAmount = parseSUDT(outputData);
    const totalSudtAmount = BigInt(existSudtAmount) + BigInt(sendSudtAmount);
    console.log(/totalSudtAmount/, totalSudtAmount);
    const sUdtLeSend = toHexInLittleEndian(totalSudtAmount, 16);
    rawTx.outputsData.push(sUdtLeSend);
  } else {
    toSudtCapacity = SUDT_MIN_AMOUNT * 10 ** 8;
    toSudtOutputCell = {
      capacity: `0x${new BN(toSudtCapacity).toString(16)}`,
      lock: {
        hashType: toLockScript.hashType as ScriptHashType,
        codeHash: toLockScript.codeHash,
        args: toLockScript.args,
      },
      type: {
        hashType: sUdtTypeScript.hashType as ScriptHashType,
        codeHash: sUdtTypeScript.codeHash,
        args: sUdtTypeScript.args,
      },
    };
    rawTx.outputs.push(toSudtOutputCell);
    const sUdtLeSend = toHexInLittleEndian(BigInt(sendSudtAmount), 16);
    rawTx.outputsData.push(sUdtLeSend);
  }

  // 2. output | input sudt charge
  const { capacity, lock, type } = sUdtOutput;
  const sUdtOutputCell = {
    capacity: capacity,
    lock: {
      hashType: lock.hashType as ScriptHashType,
      codeHash: lock.codeHash,
      args: lock.args,
    },
    type: {
      hashType: type.hashType as ScriptHashType,
      codeHash: type.codeHash,
      args: type.args,
    },
  };
  rawTx.outputs.push(sUdtOutputCell);
  const sUdtAmountCharge = sUdtAmount - sendSudtAmount;
  console.log(/sUdtAmountCharge/, sUdtAmountCharge);
  const sUdtLeCharge = toHexInLittleEndian(BigInt(sUdtAmountCharge), 16);
  rawTx.outputsData.push(sUdtLeCharge);

  // 3. output | input ckb charge
  const ckbCharge = inputCkbCells.total - toSudtCapacity - fee;
  console.log(/ckbCharge/, ckbCharge);
  rawTx.outputs.push({
    capacity: `0x${new BN(ckbCharge).toString(16)}`,
    lock: {
      hashType: fromLockScript.hashType as ScriptHashType,
      codeHash: fromLockScript.codeHash,
      args: fromLockScript.args,
    },
  });
  rawTx.outputsData.push('0x');

  const signObj = {
    target: scriptToHash(fromLockScript),
    config: config,
    tx: rawTx,
    fee,
  };
  return signObj;
}
