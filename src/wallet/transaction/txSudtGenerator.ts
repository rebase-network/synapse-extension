import { BN } from 'bn.js';
import { scriptToHash, toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils/lib';
import _ from 'lodash';
import { Cell } from '@nervosnetwork/ckb-sdk-core/lib/generateRawTransaction';
import { SUDT_MIN_AMOUNT } from '../const';
import { ScriptHashType } from '@keyper/specs/types';

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

  // 1. input CKB
  for (let i = 0; i < inputCkbCells.cells.length; i++) {
    const element = inputCkbCells.cells[i];
    rawTx.inputs.push({
      previousOutput: element.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }
  rawTx.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  // 2. input Sudt
  rawTx.inputs.push(sUdtInput);
  rawTx.witnesses.push('0x');

  // 1. output transfer to
  const toSudtCapacity = SUDT_MIN_AMOUNT * 10 ** 8;
  rawTx.outputs.push({
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
  });
  const sUdtLeSend = toHexInLittleEndian(BigInt(sendSudtAmount), 16);
  rawTx.outputsData.push(sUdtLeSend);

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
  const sUdtLeCharge = toHexInLittleEndian(BigInt(sUdtAmountCharge), 16);
  rawTx.outputsData.push(sUdtLeCharge);

  // 3. output | input ckb charge
  const ckbCharge = inputCkbCells.total - toSudtCapacity - fee;

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
    tx: rawTx,
    fee,
  };
  return signObj;
}
