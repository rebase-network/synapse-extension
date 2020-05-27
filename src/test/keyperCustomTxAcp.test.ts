const BN = require('bn.js');

const { addressToScript } = require('@keyper/specs');
const { scriptToHash } = require('@nervosnetwork/ckb-sdk-utils/lib');

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const nodeUrl = 'http://101.200.147.143:8117/rpc';
const ckb = new CKB(nodeUrl);

describe('transaction test', () => {
  const privateKey = '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1';
  const fromAddress =
    'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhxuy3pat96shpxvvl7vf2e6ae55u6fk564sc527';
    // {
    //     "args": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d"
    //     "code_hash": "0x7783e303a1945ba9df86f0bc2cc1543a0992747954f3d3170cec08e1bcce6d8b"
    //                  secp256k1 / anyone-can-pay
    //     "hash_type": "type"
    //     }    
  const toAddress =
    'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyh66u9fhwq3z7v7l28tfj68fswuu8ye99clwycsh';
    // Code Hash: 0x7783e303a1945ba9df86f0bc2cc1543a0992747954f3d3170cec08e1bcce6d8b
    //            secp256k1 / anyone-can-pay
    // Args:0xcb350b1f694b22ea9a31c0847461281779141788
    // Hash Type: type

//   const sendCapacity = BigInt(11100000000);
//   const sendFee = BigInt(1100000000);
//   const lockHash = '0xe3e51277b980c363749d7ebd5289ee6a0db13fff92a0b6bc538628b214a048ba';
//   const password = '123456';

  it('send Anypay', async () => {
    jest.setTimeout(100000);

    const anyOnePayDeps = {
      hashType: 'type',
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      outPoint: {
        txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',//???
        index: '0x0',
      },
    }; //can't delete

    const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
    const lockHash = ckb.generateLockHash(publicKeyHash, anyOnePayDeps);

    // const totalcapacity = new BN(toAmount);
    const capacity = new BN(11100000000)
    const toAmount = new BN(11100000000);
    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const unspentCells = await ckb.loadCells({
      lockHash,
    });

    const rawTx = await createRawTxSecp256(toAmount, capacity, toLock, unspentCells, lock, anyOnePayDeps);
    console.log('--- rawTx ---',JSON.stringify(rawTx));

    rawTx.witnesses = rawTx.inputs.map(() => '0x');
    rawTx.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: '',
    };

    const signObj = {
      target: scriptToHash(lock),
      tx: rawTx,
    };

    const signedTx = ckb.signTransaction(privateKey)(rawTx);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});

async function createRawTxSecp256(toAmount, capacity, toLock, cells, lock, deps) {
  const rawTx = {
    version: '0x0',
    cellDeps: [
      {
        outPoint: deps.outPoint,
        depType: 'depGroup',
      },
    ],
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  };
  rawTx.outputs.push({
    capacity: `0x${new BN(toAmount).toString(16)}`,
    lock: toLock,
  });
  rawTx.outputsData.push('0x');

  let totalcapacity = new BN(0);
  // const total = new BN(toAmount).add(new BN("1000"));
  for (let i = 0; i < cells.length; i++) {
    const element = cells[i].outPoint;

    rawTx.inputs.push({
      previousOutput: {
        txHash: element.txHash,
        index: element.index,
      },
      since: '0x0',
    });
    // rawTx.witnesses.push('0x');
    totalcapacity = totalcapacity.add(new BN(cells[i].capacity));
  }
  //   rawTx.witnesses[0] = {
  //     lock: '',
  //     inputType: '',
  //     outputType: '',
  //   };
  // if (cells.total.gt(total) && cells.total.sub(total).gt(new BN("6100000000"))) {
  const changeCapacity = totalcapacity.sub(toAmount).sub(capacity);
  rawTx.outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock: lock,
  });
  rawTx.outputsData.push('0x');
  // }
  return rawTx;
}
//Seccp256k1---lockscript
// {
//     "hashType":"type",
//     "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
//     "outPoint":{
//         "txHash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
//         "index":"0x0"
//     }
// }
