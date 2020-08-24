// import { BN } from 'bn.js';
// import { scriptToHash, toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils/lib';
// import _ from 'lodash';
// import { Cell } from '@nervosnetwork/ckb-sdk-core/lib/generateRawTransaction';
// import { ScriptHashType } from '@keyper/specs/types';
// import { SUDT_MIN_CELL_CAPACITY, CKB_TOKEN_DECIMALS } from '@src/utils/constants';

// export interface CreateRawTxResult {
//   tx: CKBComponents.RawTransaction;
//   target: string;
// }

// export interface CkbCells {
//   cells: Cell[];
//   total: any;
// }

// export function createSudtRawTx(
//   inputCkbCells: CkbCells,
//   fromLockScript: CKBComponents.Script,
//   mintSudtAmount,
//   toLockScript: CKBComponents.Script,
//   sudtLockScript: CKBComponents.Script,
//   deps,
//   fee,
// ): CreateRawTxResult {
//   const rawTx = {
//     version: '0x0',
//     cellDeps: deps,
//     headerDeps: [],
//     inputs: [],
//     outputs: [],
//     witnesses: [],
//     outputsData: [],
//   };
//   const config = { index: 0, length: -1 };

//   // 1.input CKB
//   for (let i = 0; i < inputCkbCells.cells.length; i++) {
//     const element = inputCkbCells.cells[i];
//     rawTx.inputs.push({
//       previousOutput: element.outPoint,
//       since: '0x0',
//     });
//     rawTx.witnesses.push('0x');
//   }
//   rawTx.witnesses[0] = {
//     lock: '',
//     inputType: '',
//     outputType: '',
//   };

//   // 1. output | mint sudt
//   const lockHash = scriptToHash(sudtLockScript);
//   const toSudtCapacity = SUDT_MIN_CELL_CAPACITY * CKB_TOKEN_DECIMALS;
//   const toSudtOutputCell = {
//     capacity: `0x${new BN(toSudtCapacity).toString(16)}`,
//     lock: {
//       hashType: toLockScript.hashType as ScriptHashType,
//       codeHash: toLockScript.codeHash,
//       args: toLockScript.args,
//     },
//     type: {
//       hashType: 'data' as ScriptHashType,
//       codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
//       args: lockHash,
//     },
//   };
//   rawTx.outputs.push(toSudtOutputCell);
//   const sUdtLeSend = toHexInLittleEndian(BigInt(mintSudtAmount), 16);
//   rawTx.outputsData.push(sUdtLeSend);

//   // 2. output | ckb charge
//   const ckbCharge = BigInt(inputCkbCells.total) - BigInt(toSudtCapacity) - BigInt(fee);
//   rawTx.outputs.push({
//     capacity: `0x${new BN(ckbCharge).toString(16)}`,
//     lock: {
//       hashType: fromLockScript.hashType as ScriptHashType,
//       codeHash: fromLockScript.codeHash,
//       args: fromLockScript.args,
//     },
//   });
//   rawTx.outputsData.push('0x');

//   const signObj = {
//     target: scriptToHash(fromLockScript),
//     config,
//     tx: rawTx,
//   };
//   return signObj;
// }
