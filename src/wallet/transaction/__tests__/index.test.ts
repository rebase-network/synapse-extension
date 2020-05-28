import { BN } from 'bn.js';
import { createRawTx } from '../index';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
const CKB = require('@nervosnetwork/ckb-sdk-core').default;

describe('Transaction test', () => {
  const ckb = new CKB('http://101.200.147.143:8117/rpc');

  it.skip('createRawTx test secp256k1', async () => {
    const privateKey = '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1';
    const fromAddress = 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae';
    const toAddress = 'ckt1qyqvkdgtra55kgh2ngcuppr5vy5pw7g5z7yqrajwwp';

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);
    const totalConsumed = toAmount.add(fee);

    const deps = [
      {
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        depType: 'depGroup',
      },
    ];

    const lockHash = '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2';
    const unspentCells = await getUnspentCells(lockHash);
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, totalConsumed, fee);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });

  it.skip('createRawTx test anyonepay', async () => {
    const privateKey = '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1';
    const fromAddress =
      'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhxuy3pat96shpxvvl7vf2e6ae55u6fk564sc527';
    const toAddress =
      'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyh66u9fhwq3z7v7l28tfj68fswuu8ye99clwycsh';
    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);
    const totalConsumed = toAmount.add(fee);

    const deps = [
      {
        outPoint: {
          txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
          index: '0x0',
        },
        depType: 'depGroup',
      },
    ];
    const lockHash = '0x6af8c2199802665ea2a8ed85b087b1ac26b47b332dfe7322c6b34e38f1a2f129';
    const unspentCells = await getUnspentCells(lockHash);
    console.log('--- lockHash ---',lockHash);
    console.log('--- unspentCells ---',JSON.stringify(unspentCells));

    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, totalConsumed, fee);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });

});
