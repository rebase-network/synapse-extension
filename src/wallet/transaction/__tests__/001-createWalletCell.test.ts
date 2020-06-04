import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { bobAddresses, walletCellAddresses } from '../../../test/fixture/address';
import { anypayDep } from '../../../test/fixture/deps';

describe('Anypay Wallet', () => {
  const ckb = new CKB('http://127.0.0.1:8114');

  it('create anypay wallet', async () => {
    const privateKey = '0x0c7197eb7b24c870344bf5bacae96842c9092ba6da2373f43168cdd2b6d97d72';
    const fromAddress = 'ckt1qyqtcahqdff3j0fukt7save3yd7tqg07884qceg6n0';
    const toAddress = 'ckt1qyqv7rp54j90fgk8scdnxeqwejd0f6xn8rcsy43faq';

    const fromLock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(40000000000);
    const fee = new BN(100000000);

    const deps = [
      {
        depType: 'depGroup',
        outPoint: {
          txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
          index: '0x0',
        },
      },
      {
        depType: 'code',
        outPoint: {
          txHash: '0x9b08d3645320e5915c8682e591f36f951dc14a733bdaa58a5e6ccefdb9c4b5b0',
          index: '0x0',
        },
      },
    ];

    const secp256k1Dep = await ckb.loadSecp256k1Dep();
    const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
    const dataArgs = `0x${ckb.utils.blake160("0x0335dc5d273ee1575d4a89a24859d92d25053c493b125a38d747d46635306d8a89", 'hex')}`;

    const lockScript = {
      hashType: 'type',
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      args: publicKeyHash,
    };
    const lockHash = ckb.utils.scriptToHash(lockScript);
    const unspentCells = await ckb.loadCells({
      lockHash: lockHash,
    });

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createWalletCellRawTx(toAmount, toLock, cells, fromLock, deps, fee,dataArgs);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
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
  dataArgs
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

  const dataLockScript = {
    hashType: 'data',
    codeHash: '0x0fb343953ee78c9986b091defb6252154e0bb51044fd2879fde5b27314506111',
    args: dataArgs,
  };
  rawTx.outputs.push({
    capacity: `0x${new BN(toAmount).toString(16)}`,
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
