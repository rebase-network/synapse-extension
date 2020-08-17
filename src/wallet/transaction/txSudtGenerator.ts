import { BN } from 'bn.js';
import { scriptToHash, toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils/lib';
import _ from 'lodash';
import { Cell } from '@nervosnetwork/ckb-sdk-core/lib/generateRawTransaction';
import { ScriptHashType } from '@keyper/specs/types';
import {
  SUDT_MIN_CELL_CAPACITY,
  CKB_TOKEN_DECIMALS,
  EMPTY_OUTPUT_DATA,
} from '@src/utils/constants';

export interface CreateRawTxResult {
  tx: CKBComponents.RawTransaction;
  target: string;
}

export interface CkbCells {
  cells: Cell[];
  total: any;
}

export function createSudtRawTx(
  inputCkbCells: CkbCells,
  inputSudtCells: any,
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
  const config = { index: 0, length: -1 };

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

  // 2. input SUDT
  for (let i = 0; i < inputSudtCells.cells.length; i++) {
    const element = inputSudtCells.cells[i];
    rawTx.inputs.push({
      previousOutput: element.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }
  const { sudtCKBCapacity } = inputSudtCells;
  const { lock, type } = inputSudtCells.cells[0];
  const sUdtLockScript = {
    hashType: lock.hashType as ScriptHashType,
    codeHash: lock.codeHash,
    args: lock.args,
  };

  const sUdtTypeScript = {
    hashType: type.hashType as ScriptHashType,
    codeHash: type.codeHash,
    args: type.args,
  };

  // 1. output transfer to
  // toAddress have the same sudt
  const toSudtCapacity = SUDT_MIN_CELL_CAPACITY * CKB_TOKEN_DECIMALS;
  const toSudtOutputCell = {
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

  // 2. output | input sudt charge
  const sUdtAmountCharge = BigInt(sUdtAmount) - BigInt(sendSudtAmount);
  const sUdtLeCharge = toHexInLittleEndian(BigInt(sUdtAmountCharge), 16);
  // input sudt charge
  let chargeSudtCapacity = 0;
  if (sUdtLeCharge !== EMPTY_OUTPUT_DATA) {
    chargeSudtCapacity = SUDT_MIN_CELL_CAPACITY * 10 ** 8;
    const sUdtOutputCell = {
      capacity: `0x${new BN(chargeSudtCapacity).toString(16)}`,
      lock: {
        hashType: sUdtLockScript.hashType as ScriptHashType,
        codeHash: sUdtLockScript.codeHash,
        args: sUdtLockScript.args,
      },
      type: {
        hashType: sUdtTypeScript.hashType as ScriptHashType,
        codeHash: sUdtTypeScript.codeHash,
        args: sUdtTypeScript.args,
      },
    };
    rawTx.outputs.push(sUdtOutputCell);
    rawTx.outputsData.push(sUdtLeCharge);
  }

  // 3. output | input ckb charge
  // - ckb charge of SUDT
  const sudtCKBCharge = BigInt(sudtCKBCapacity) - BigInt(chargeSudtCapacity);
  const ckbCharge =
    BigInt(inputCkbCells.total) + BigInt(sudtCKBCharge) - BigInt(toSudtCapacity) - BigInt(fee);
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
    config,
    tx: rawTx,
  };
  return signObj;
}
