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
  let config = { index: 0, length: -1 };

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
    const element = inputSudtCells.cells[0];
    rawTx.inputs.push({
      previousOutput: element.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }

  const { sudtCKBCapacity, sudtAmount } = inputSudtCells;
  console.log(/sudtCKBCapacity/, sudtCKBCapacity);
  console.log(/sudtAmount/, sudtAmount);

  const {lock,type}= inputSudtCells.cells[0]
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
  console.log(/sUdtLockScript/,sUdtLockScript);
  console.log(/sUdtTypeScript/,sUdtTypeScript);

  // 1. output transfer to
  // toAddress have the same sudt
  const toSudtCapacity = SUDT_MIN_AMOUNT * 10 ** 8;
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
  const chargeSudtCapacity = SUDT_MIN_AMOUNT * 10 ** 8;
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
  // sUdtAmount 或者 sudtAmount
  const sUdtAmountCharge = sUdtAmount - sendSudtAmount;
  console.log(/sUdtAmountCharge/, sUdtAmountCharge);
  const sUdtLeCharge = toHexInLittleEndian(BigInt(sUdtAmountCharge), 16);
  rawTx.outputsData.push(sUdtLeCharge);

  // 3. output | input ckb charge
  const ckbCharge =
    BigInt(inputCkbCells.total) +
    BigInt(sudtCKBCapacity) -
    BigInt(toSudtCapacity) -
    BigInt(chargeSudtCapacity) -
    BigInt(fee);
  console.log(/total/, BigInt(inputCkbCells.total));
  console.log(/sudtCKBCapacity/, BigInt(sudtCKBCapacity));
  console.log(/toSudtCapacity/, BigInt(toSudtCapacity));
  console.log(/chargeSudtCapacity/, BigInt(chargeSudtCapacity));
  console.log(/fee/, BigInt(fee));
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
