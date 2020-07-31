import { BN } from 'bn.js';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import _ from 'lodash';
import calculateTxFee from './calculateFee';

export interface CreateRawTxResult {
  tx: CKBComponents.RawTransaction;
  fee: string;
  target: string;
}

export function createRawTx(
  toAmount,
  toLockScript: CKBComponents.Script,
  inputCells,
  fromLockScript: CKBComponents.Script,
  deps,
  fee,
  toDataHex?,
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

  // inputs
  for (let i = 0; i < inputCells.cells.length; i += 1) {
    const element = inputCells.cells[i];
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

  // outputs
  rawTx.outputs.push({
    capacity: `0x${new BN(toAmount).toString(16)}`,
    lock: toLockScript,
  });
  if (!_.isEmpty(toDataHex)) {
    rawTx.outputsData.push(toDataHex);
  } else {
    rawTx.outputsData.push('0x');
  }

  //   const totalConsumed = toAmount.add(fee);
  const totalConsumed = toAmount;
  if (
    inputCells.total.gt(totalConsumed) &&
    inputCells.total.sub(totalConsumed).gt(new BN('6100000000'))
  ) {
    rawTx.outputs.push({
      capacity: `0x${inputCells.total.sub(totalConsumed).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push('0x');
  }
  // calculate fee and reconstructor transaction
  const calculateTx = calculateTxFee(rawTx);
  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: calculateTx.tx,
    fee: calculateTx.fee,
  };

  return signObj;
}

export function createAnyPayRawTx(
  toAmount,
  toLockScript: CKBComponents.Script,
  inputCells,
  fromLockScript: CKBComponents.Script,
  deps,
  fee,
  walletCells,
  walletTotalCapity,
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

  // inputs-wallet
  for (let i = 0; i < walletCells.length; i += 1) {
    rawTx.inputs.push({
      previousOutput: walletCells[i].outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }

  for (let i = 0; i < inputCells.cells.length; i += 1) {
    const element = inputCells.cells[i];
    rawTx.inputs.push({
      previousOutput: element.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }
  rawTx.witnesses[1] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  // outputs-wallet
  const walletNewCapacity = new BN(walletTotalCapity).add(toAmount);
  rawTx.outputs.push({
    capacity: `0x${new BN(walletNewCapacity).toString(16)}`,
    lock: toLockScript,
  });
  rawTx.outputsData.push('0x');

  // outpus-charge
  // const totalCost = toAmount.add(fee);
  const totalCost = toAmount;
  if (inputCells.total.gt(totalCost) && inputCells.total.sub(totalCost).gt(new BN('6100000000'))) {
    rawTx.outputs.push({
      capacity: `0x${inputCells.total.sub(totalCost).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push('0x');
  }

  // calculate fee and reconstructor transaction
  const calculateTx = calculateTxFee(rawTx);
  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: calculateTx.tx,
    fee: calculateTx.fee,
  };

  return signObj;
}

/**
 *
 * the function update inputcell's outputdata to '0x'
 * @export
 * @param {*} dataCapacity: the capacity of the inputcells
 * @param {CKBComponents.Script} fromLockScript : input data cell
 * @param {*} inputDataCells : the cell of contains the data
 * @param {*} deps : secp256k1| anypay | kaccak256 contract
 * @param {*} fee : the fee of transaction
 * @param {*} [toDataHex]: the data Hex
 * @returns
 */
export function createRawTxDeleteData(
  fromLockScript: CKBComponents.Script,
  inputOutPoint,
  dataCapacity,
  deps,
  fee,
) {
  const rawTx = {
    version: '0x0',
    cellDeps: deps,
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };

  // inputs
  rawTx.inputs.push({
    previousOutput: inputOutPoint,
    since: '0x0',
  });
  rawTx.witnesses.push('0x');
  rawTx.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  // outputs
  const outputCapacity = dataCapacity.sub(fee);
  rawTx.outputs.push({
    capacity: `0x${new BN(outputCapacity).toString(16)}`,
    lock: fromLockScript,
  });
  rawTx.outputsData.push('0x');

  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: rawTx,
  };

  return signObj;
}

/**
 *
 * the function update inputcell's outputdata from oldData to newData
 *     1- delete: update outputdata to '0x'
 *     2- update: update outputdata to newDataHex,
 * @export
 * @param {*} deps : secp256k1| anypay | kaccak256 contract
 * @param {*} fee : the fee of transaction
 * @param {*} fromLockScript : input data cell
 * @param {*} cellDataCapacity: the capacity of the dataCell
 * @param {*} oldDataCapacity : capacity of the old data
 * @param {*} newDataCapacity : capacity of the new data
 * @param {*} newDataHex: Hex of the new Data
 * @returns
 */
export function createRawTxUpdateData(
  deps,
  fee,
  fromLockScript: CKBComponents.Script,
  inputOutPoint,
  cellDataCapacity,
  oldDataCapacity,
  newDataCapacity,
  newDataHex,
  unspentCells?,
) {
  const rawTx = {
    version: '0x0',
    cellDeps: deps,
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };

  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  if (oldDataCapacity > newDataCapacity + fee) {
    // inputs
    rawTx.inputs.push({
      previousOutput: inputOutPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
    rawTx.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: '',
    };

    // outputs
    const outputCapacity = cellDataCapacity - fee;
    rawTx.outputs.push({
      capacity: `0x${new BN(outputCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    if (!_.isEmpty(newDataHex)) {
      rawTx.outputsData.push(newDataHex);
    } else {
      rawTx.outputsData.push('0x');
    }
  } else {
    const freeTotalCapacity = unspentCells.reduce(getTotalCapity, 0);

    // inputs - 001 - data cell
    rawTx.inputs.push({
      previousOutput: inputOutPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
    rawTx.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: '',
    };
    // inputs - 002 - free cell
    for (let i = 0; i < unspentCells.length; i += 1) {
      const cell = unspentCells[i];
      rawTx.inputs.push({
        previousOutput: cell.outPoint,
        since: '0x0',
      });
      rawTx.witnesses.push('0x');
    }

    // outputs 001- data cell
    const dataCapacity = newDataCapacity + BigInt(61 * 10 ** 8);
    rawTx.outputs.push({
      capacity: `0x${new BN(dataCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push(newDataHex);

    // outputs 002- change|free cell
    const freeCapacity = freeTotalCapacity + oldDataCapacity - newDataCapacity - fee;
    rawTx.outputs.push({
      capacity: `0x${new BN(freeCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push('0x');
  }

  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: rawTx,
  };

  return signObj;
}

/**
 *
 * the function update inputcell's outputdata from oldData to newData
 * @export
 * @param {*} deps : secp256k1| anypay | kaccak256 contract
 * @param {*} fee :  fee of transaction
 * @param {*} fromLockScript : input data cell
 * @param {*} inputOutPoint : txHash, index
 * @param {*} oldDataCellCapacity : capacity of data cell
 * @param {*} unspentCells : unspent cells
 * @param {*} newDataCapacity : capacity of new data
 * @param {*} newDataHex: Hex of new Data
 * @returns
 */
export function createUpdateDataRawTx(
  deps,
  fee,
  fromLockScript: CKBComponents.Script,
  inputOutPoint,
  dataCellCapacity,
  unspentCells,
  newDataCapacity,
  newDataHex,
) {
  const rawTx = {
    version: '0x0',
    cellDeps: deps,
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };

  function getTotalCapity(total, cell) {
    return BigInt(total) + BigInt(cell.capacity);
  }
  const unspentTotalCapacity = unspentCells.reduce(getTotalCapity, 0);

  // inputs - 001 - data cell
  rawTx.inputs.push({
    previousOutput: inputOutPoint,
    since: '0x0',
  });
  rawTx.witnesses.push('0x');
  rawTx.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };
  // inputs - 002 - free cell
  for (let i = 0; i < unspentCells.length; i += 1) {
    const cell = unspentCells[i];
    rawTx.inputs.push({
      previousOutput: cell.outPoint,
      since: '0x0',
    });
    rawTx.witnesses.push('0x');
  }

  if (newDataHex === '0x') {
    const unspentCapacity = unspentTotalCapacity + dataCellCapacity - fee;
    rawTx.outputs.push({
      capacity: `0x${new BN(unspentCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push('0x');
  } else {
    // outputs 001- data cell
    const newDataCellCapacity = newDataCapacity + BigInt(61 * 10 ** 8);
    rawTx.outputs.push({
      capacity: `0x${new BN(newDataCellCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push(newDataHex);

    // outputs 002- change cell
    const unspentCapacity = unspentTotalCapacity + dataCellCapacity - newDataCellCapacity - fee;
    rawTx.outputs.push({
      capacity: `0x${new BN(unspentCapacity).toString(16)}`,
      lock: fromLockScript,
    });
    rawTx.outputsData.push('0x');
  }

  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: rawTx,
  };

  return signObj;
}
