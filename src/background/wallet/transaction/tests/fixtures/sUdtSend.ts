import LOCKS_INFO from '@common/utils/constants/locksInfo';
import { aliceAddresses } from '@src/tests/fixture/address';
import { TypesInfo } from '@common/utils/constants/typesInfo';

const { codeHash: anyPayCodeHash, txHash: anypayTxHash } = LOCKS_INFO.testnet.anypay;

export default {
  createMutiAllTo: {
    fromAddress: 'ckt1qyqxq62839823nh2x82zhnrt5ktj88n5pmxs63njjf',
    fromLockType: 'Secp256k1',
    lockHash: '0x02b11786f5f5ee9fd12bd7b67d7967b1d83c5602df0d22a7bb535eec90856f24',
    typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
    toAddress: aliceAddresses.anyPay.address,
    sendSudtAmount: 150000,
    fee: 10000,
    password: '123456',
    expectSignedTx: {
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
            txHash: '0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
          depType: 'code',
        },
      ],
      headerDeps: [],
      inputs: [
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            index: '0x1',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
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
            codeHash: '0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356',
            args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x-2710',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x606947894ea8ceea31d42bcc6ba597239e740ecd',
          },
        },
      ],
      witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
      outputsData: [
        '0xf0490200000000000000000000000000',
        '0x54512a00000000000000000000000000',
        '0x',
      ],
    },
  },
  createMutiPartTo: {
    fromAddress: 'ckt1qyqxq62839823nh2x82zhnrt5ktj88n5pmxs63njjf',
    fromLockType: 'Secp256k1',
    lockHash: '0x02b11786f5f5ee9fd12bd7b67d7967b1d83c5602df0d22a7bb535eec90856f24',
    typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
    toAddress: aliceAddresses.anyPay.address,
    sendSudtAmount: 90000,
    fee: 10000,
    password: '123456',
    expectSignedTx: {
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
            txHash: '0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
          depType: 'code',
        },
      ],
      headerDeps: [],
      inputs: [
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            index: '0x1',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
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
            codeHash: '0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356',
            args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x-2710',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x606947894ea8ceea31d42bcc6ba597239e740ecd',
          },
        },
      ],
      witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
      outputsData: [
        '0x905f0100000000000000000000000000',
        '0xb43b2b00000000000000000000000000',
        '0x',
      ],
    },
  },
  createSingleAllTo: {
    fromAddress: 'ckt1qyqyful8xljcwnue3vvvuf0zeucc4yvuypmqlxdkmh',
    fromLockType: 'Secp256k1',
    lockHash: '0xc86d0baf6b7813807680dc93252d408aba37764cbdd01741d4a4dbef9683e580',
    typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
    toAddress: aliceAddresses.anyPay.address,
    sendSudtAmount: 10000,
    fee: 10000,
    password: '123456',
    expectSignedTx: {
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
            txHash: '0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
          depType: 'code',
        },
      ],
      headerDeps: [],
      inputs: [
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            index: '0x1',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
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
            codeHash: '0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356',
            args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x-2710',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x44f3e737e5874f998b18ce25e2cf318a919c2076',
          },
        },
      ],
      witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
      outputsData: [
        '0x10270000000000000000000000000000',
        '0x34742c00000000000000000000000000',
        '0x',
      ],
    },
  },
  createSinglePartTo: {
    fromAddress: 'ckt1qyqyful8xljcwnue3vvvuf0zeucc4yvuypmqlxdkmh',
    fromLockType: 'Secp256k1',
    lockHash: '0xc86d0baf6b7813807680dc93252d408aba37764cbdd01741d4a4dbef9683e580',
    typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
    toAddress: aliceAddresses.anyPay.address,
    sendSudtAmount: 5000,
    fee: 10000,
    password: '123456',
    expectSignedTx: {
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
            txHash: '0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
          depType: 'code',
        },
      ],
      headerDeps: [],
      inputs: [
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            index: '0x1',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
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
            codeHash: '0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356',
            args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x-2710',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x44f3e737e5874f998b18ce25e2cf318a919c2076',
          },
        },
      ],
      witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
      outputsData: [
        '0x88130000000000000000000000000000',
        '0xbc872c00000000000000000000000000',
        '0x',
      ],
    },
  },
  createSinglePartToError: {
    fromAddress: 'ckt1qyqyful8xljcwnue3vvvuf0zeucc4yvuypmqlxdkmh',
    fromLockType: 'Secp256k1',
    lockHash: '0xc86d0baf6b7813807680dc93252d408aba37764cbdd01741d4a4dbef9683e580',
    typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
    toAddress: aliceAddresses.anyPay.address,
    sendSudtAmount: 3000,
    fee: 10000,
    password: '123456',

    expectSignedTx: {
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
            txHash: '0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: TypesInfo.testnet.simpleudt.txHash,
            index: TypesInfo.testnet.simpleudt.index,
          },
          depType: 'code',
        },
      ],
      headerDeps: [],
      inputs: [
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
            index: '0x1',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
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
            codeHash: '0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356',
            args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
          },
          type: {
            hashType: TypesInfo.testnet.simpleudt.hashType,
            codeHash: TypesInfo.testnet.simpleudt.codeHash,
            args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
          },
        },
        {
          capacity: '0x-2710',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x44f3e737e5874f998b18ce25e2cf318a919c2076',
          },
        },
      ],
      witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
      outputsData: [
        '0xb80b0000000000000000000000000000',
        '0x8c8f2c00000000000000000000000000',
        '0x',
      ],
    },
  },
};
