import _ from 'lodash';
import { addressToScript, ScriptHashType } from '@keyper/specs';
import { getUnspentCells } from '@utils/apis';
import getCKB from '@utils/ckb';
import { signTx } from '@src/keyper/keyperwallet';
import NetworkManager from '@common/networkManager';
import { getDepFromLockType } from '@src/utils/deps';
import {
  ADDRESS_TYPE_CODEHASH,
  SUDT_MIN_CELL_CAPACITY,
  CKB_TOKEN_DECIMALS,
} from '@src/utils/constants';
import { getDepFromType } from '@src/utils/constants/typesInfo';
import { Cell } from '@nervosnetwork/ckb-sdk-core/lib/generateRawTransaction';
import { scriptToHash, toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils';
import { parseSUDT } from '@src/utils';

import BN = require('bn.js');

export const TestDaiTypeScript = {
  hashType: 'data' as ScriptHashType,
  codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
  args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
};

export const TestDaiTypeHash = scriptToHash(TestDaiTypeScript); // '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899';
console.log('TestDaiTypeHash: ', TestDaiTypeHash);

export interface GenerateTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
}

export interface CreateRawTxResult {
  tx: CKBComponents.RawTransaction;
  target: string;
}

export interface CkbCells {
  cells: Cell[];
  total: any;
}

export const getInputCKBCells = async (lockHash, params) => {
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
  }

  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const totalCapity = unspentCells.reduce(getTotalCapity, 0);
  const inputCells = {
    cells: unspentCells,
    total: new BN(totalCapity),
  };
  return inputCells;
};

export const getInputSudtCells = async (lockHash, params) => {
  const unspentCells = await getUnspentCells(lockHash, params);
  // Error handling
  if (unspentCells.errCode !== undefined && unspentCells.errCode !== 0) {
    return unspentCells;
  }

  if (_.isEmpty(unspentCells)) {
    throw new Error('There is not available live cells');
  }

  function getTotalCKBCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const sudtCKBCapity = unspentCells.reduce(getTotalCKBCapity, 0);

  function getTotalSudtCapity(total, cell) {
    return BigInt(total) + BigInt(parseSUDT(cell.outputData));
  }
  const sudtAmount = unspentCells.reduce(getTotalSudtCapity, 0);

  const inputCells = {
    cells: unspentCells,
    sudtCKBCapacity: sudtCKBCapity,
    sudtAmount,
  };
  return inputCells;
};

export const getLockScriptName = (lockScript: CKBComponents.Script) => {
  let lockScriptName = null;
  if (lockScript.codeHash === ADDRESS_TYPE_CODEHASH.Secp256k1) {
    lockScriptName = 'Secp256k1';
  } else if (lockScript.codeHash === ADDRESS_TYPE_CODEHASH.Keccak256) {
    lockScriptName = 'Keccak256';
  } else if (lockScript.codeHash === ADDRESS_TYPE_CODEHASH.AnyPay) {
    lockScriptName = 'AnyPay';
  }
  return lockScriptName;
};

/**
 *
 * create Mint Sudt Raw transaction.
 * @export
 * @param {CkbCells} inputCkbCells
 * @param {CKBComponents.Script} fromLockScript
 * @param {*} redeemSudtAmount
 * @param {CKBComponents.Script} toLockScript
 * @param {CKBComponents.Script} sudtLockScript
 * @param {*} deps
 * @param {*} fee
 * @returns {CreateRawTxResult}
 */
export function createSudtRawTx(
  inputCkbCells: CkbCells,
  inputSudtCells,
  fromLockScript: CKBComponents.Script,
  redeemSudtAmount,
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

  // 1.input CKB
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

  // 1. output | charge sudt //剩余SUDT
  const toSudtCapacity = SUDT_MIN_CELL_CAPACITY * CKB_TOKEN_DECIMALS;
  const toSudtOutputCell = {
    capacity: `0x${new BN(toSudtCapacity).toString(16)}`,
    lock: {
      hashType: toLockScript.hashType as ScriptHashType,
      codeHash: toLockScript.codeHash,
      args: toLockScript.args,
    },
    type: TestDaiTypeScript,
  };
  rawTx.outputs.push(toSudtOutputCell);
  const sUdtAmount = inputSudtCells.sudtAmount;
  const sUdtAmountCharge = BigInt(sUdtAmount) - BigInt(redeemSudtAmount);
  const sUdtLeSend = toHexInLittleEndian(BigInt(sUdtAmountCharge), 16);
  rawTx.outputsData.push(sUdtLeSend);

  // 3. output | input ckb charge //剩余CKB
  const sudtCKBCharge = BigInt(sudtCKBCapacity);
  const ckbCharge =
    BigInt(inputCkbCells.total) + BigInt(sudtCKBCharge) - BigInt(toSudtCapacity) - BigInt(fee);
  rawTx.outputs.push({
    capacity: `0x${new BN(ckbCharge.toString()).toString(16)}`,
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

export const redeemSudtTx = async (fromAddress, redeemSudtAmount, fee) => {
  const toAddress = fromAddress;
  const fromLockScript = addressToScript(fromAddress);
  const fromLockHash = scriptToHash(fromLockScript);
  const params = {
    capacity: SUDT_MIN_CELL_CAPACITY * CKB_TOKEN_DECIMALS,
    hasData: 'false',
  };
  // 1. input CKB cells
  const inputCkbCells = await getInputCKBCells(fromLockHash, params);
  console.log(/inputCkbCells/, inputCkbCells);

  // 2. Input sudt cells
  const sudtParams = {
    limit: '20',
    hasData: 'true',
    typeHash: TestDaiTypeHash,
  };
  console.log(/sudtParams/, sudtParams);
  const inputSudtCells = await getInputSudtCells(fromLockHash, sudtParams);
  console.log(/inputSudtCells/, inputSudtCells);

  const toLockScript = addressToScript(toAddress);
  const fromLockScripeName = getLockScriptName(fromLockScript);
  const toLockScriptName = getLockScriptName(toLockScript);

  const deps = [];
  if (fromLockScripeName === toLockScriptName) {
    const fromDepObj = await getDepFromLockType(fromLockScripeName, NetworkManager);
    deps.push(fromDepObj);
  } else {
    const fromDepObj = await getDepFromLockType(fromLockScripeName, NetworkManager);
    const toDepObj = await getDepFromLockType(toLockScriptName, NetworkManager);
    deps.push(fromDepObj);
    deps.push(toDepObj);
  }
  const sUdtDep = await getDepFromType('simpleudt', NetworkManager);
  deps.push(sUdtDep);

  let rawTxObj: any = null;
  rawTxObj = createSudtRawTx(
    inputCkbCells,
    inputSudtCells,
    fromLockScript,
    redeemSudtAmount,
    toLockScript,
    deps,
    fee,
  );
  return rawTxObj;
};

export const signSudtTransaction = async (lockHash, password, rawTxObj) => {
  if (rawTxObj.errCode !== undefined && rawTxObj.errCode !== 0) {
    return rawTxObj;
  }
  const signedTx = await signTx(lockHash, password, rawTxObj.tx, rawTxObj.config);
  return signedTx;
};

export const redeemSudtTransaction = async (
  fromAddress,
  redeemSudtAmount, // 赎回SUDT数量
  fee,
  password,
) => {
  const toAddress = fromAddress;
  const lockScript = addressToScript(toAddress);
  const lockHash = scriptToHash(lockScript);
  const rawTxObj = await redeemSudtTx(fromAddress, redeemSudtAmount, fee);

  const signedTx = await signSudtTransaction(lockHash, password, rawTxObj);
  const txResultObj = {
    txHash: null,
  };
  try {
    const ckb = await getCKB();
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    txResultObj.txHash = realTxHash;
  } catch (error) {
    console.error(`Failed to send tx: ${error}`);
  }

  return txResultObj;
};

const a = {
  version: '0x0',
  cellDeps: [
    {
      outPoint: {
        txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
        index: '0x0',
      },
      depType: 'depGroup',
    },
    {
      outPoint: {
        txHash: '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958',
        index: '0x0',
      },
      depType: 'code',
    },
  ],
  headerDeps: [],
  inputs: [
    {
      previousOutput: {
        txHash: '0x5ce0f12c872e15acaed5839391c24539e932af52bbf26d469f1cfd341bec607e',
        index: '0x1',
      },
      since: '0x0',
    },
  ],
  outputs: [
    {
      capacity: '0x34e62ce00',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
      },
      type: {
        hashType: 'data',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
      },
    },
    {
      capacity: '0x6a7f28be70',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0xe583c0ba3522dd2034e6dd9882dffbb99e8dbc3d',
      },
    },
  ],
  witnesses: [
    '0x5500000010000000550000005500000041000000bdf0d6be24433849556eb04c8088b63013416676f65d7f0b45f404d9482f95b47fc6f2abfe80416255a66ebba1ebb6d1a6206be80b308f2af13b60d359b621c501',
  ],
  outputsData: ['0x01000000000000000000000000000000', '0x'],
};
