import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { bobAddresses, walletCellAddresses } from '../../../test/fixture/address';
import { anypayDep, secp256k1Dep } from '../../../test/fixture/deps';
import { secp256k1 } from '../../../test/fixture';
import { ADDRESS_TYPE_CODEHASH } from '../../../utils/constants';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

describe('Transaction test', () => {

  jest.setTimeout(150000);

  const ckb = new CKB('http://101.200.147.143:8117/rpc');

  it('createRawTx test anyonepay', async () => {
    const privateKey = bobAddresses.privateKey;
    const fromAddress = bobAddresses.secp256k1.address;
    const toAddress = walletCellAddresses.secp256k1.address;

    const fromLock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(5000000000);
    const fee = new BN(100000000);

    const deps = [secp256k1Dep, anypayDep];
    const lockHash = bobAddresses.secp256k1.lock;
    const unspentCells = await getUnspentCells(lockHash);

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);
    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const dataLockScript = {
      hashType: 'data',
      codeHash: ADDRESS_TYPE_CODEHASH.AnyPay,
      args: toLock.args,
    };
    const dataLockHash = ckb.utils.scriptToHash(dataLockScript);
    const walletCells = await ckb.loadCells({
      lockHash: dataLockHash,
    });

    console.log('dataLockHash ===> ', ckb.utils.scriptToHash(dataLockScript));

    const signObj = createWalletCellRawTx(
      toAmount,
      toLock,
      cells,
      fromLock,
      deps,
      fee,
      walletCells,
    );
    console.log('--- rawTx ---', JSON.stringify(signObj));
    let config = {index: 0, length: -1};
    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    // signedTx.witnesses.push('0x');

    console.log('signedTx =>', JSON.stringify(signedTx));
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});

export function createWalletCellRawTx(
  toAmount,
  toLockScript: CKBComponents.Script,
  inputCells,
  fromLockScript: CKBComponents.Script,
  deps,
  fee,
  walletCells,
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

  //Inputs-001
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

  //Inputs-002
  for (let i = 0; i < walletCells.length; i++) {
    rawTx.inputs.push({
      previousOutput: walletCells[i].outPoint,
      since: '0x0',
    });
  }
//rawTx.witnesses.push('0x');

  const walletOldCapacity = new BN(BigInt(walletCells[0].capacity));
  const walletNewCapacity = walletOldCapacity.add(toAmount);
  const dataLockScript = {
    hashType: 'data',
    codeHash: ADDRESS_TYPE_CODEHASH.AnyPay,
    args: toLockScript.args,
  };
  rawTx.outputs.push({
    capacity: `0x${new BN(walletNewCapacity).toString(16)}`,
    lock: dataLockScript,
  });
  rawTx.outputsData.push('0x');

  //change
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

// signedTx => {"version":"0x0","cellDeps":[{"outPoint":{"txHash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37","index":"0x0"},"depType":"depGroup"},{"outPoint":{"txHash":"0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c","index":"0x0"},"depType":"depGroup"}],"headerDeps":[],"inputs":[{"previousOutput":{"txHash":"0xa29e12c3f01a53ed9c82ef5112df983a27a0b2d14e8a0dcbbb1930c44bfbab7d","index":"0x1"},"since":"0x0"}],"outputs":[{"capacity":"0x9502f9000","lock":{"hashType":"data","codeHash":"0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b","args":"0xce689159e47e4607d273c43d983b663a85c29cfa"}},{"capacity":"0x240052da92","lock":{"hashType":"type","codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","args":"0x9b84887ab2ea170998cff9895675dcd29cd26d4d"}}],"witnesses":["0x55000000100000005500000055000000410000007b5dc3208287c984c407caa9e1e334de180aa29cb2ea64ef2876c96d8f2b4c72667e84950e7ec9cf62b799f1171098a2f4971145c74974c4c75d89d883305ed000"],"outputsData":["0x","0x"]}
// realTxHash => "0x61e6fe9881dd86f965b185f8c097776ed6fd31000bb2b360bb54e9cff34496dd"
