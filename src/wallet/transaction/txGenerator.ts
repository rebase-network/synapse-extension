import { BN } from 'bn.js';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import * as _ from 'lodash';

export function createRawTx(
  toAmount,
  toLockScript: CKBComponents.Script,
  inputCells,
  fromLockScript: CKBComponents.Script,
  deps,
  fee,
  toDataHex?,
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

  const totalConsumed = toAmount.add(fee);
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

  const signObj = {
    target: scriptToHash(fromLockScript),
    tx: rawTx,
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
  const totalCost = toAmount.add(fee);
  if (inputCells.total.gt(totalCost) && inputCells.total.sub(totalCost).gt(new BN('6100000000'))) {
    rawTx.outputs.push({
      capacity: `0x${inputCells.total.sub(totalCost).toString(16)}`,
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
export function createRawTxUpdateData(
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
