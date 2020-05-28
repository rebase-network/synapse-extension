import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
const BN = require('bn.js');

export function createRawTx(toAmount, toLockScript:CKBComponents.Script, inputCells, 
                        fromLockScript:CKBComponents.Script, deps, fee) {
  const rawTx = {
    version: '0x0',
    cellDeps: deps,
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };

  for (let i = 0; i < inputCells.cells.length; i++) {
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

  rawTx.outputs.push({
    capacity: `0x${new BN(toAmount).toString(16)}`,
    lock: toLockScript,
  });
  rawTx.outputsData.push('0x');

  const totalConsumed = toAmount.add(fee);
  if (inputCells.total.gt(totalConsumed) && inputCells.total.sub(totalConsumed).gt(new BN('6100000000'))) {
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
