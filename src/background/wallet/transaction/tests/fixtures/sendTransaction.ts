import {
  aliceAddresses,
  aliceWallet,
  aliceWalletPwd,
  aliceWalletInStorage,
  bobAddresses,
} from '@src/tests/fixture/address';

export const generateTxFixture = {
  params: [
    aliceAddresses.secp256k1.address,
    'ckt1qyqxpmg9n822t3nl6ff8wfp6cy4ely230dss74qff7',
    '61',
    '10',
    aliceAddresses.secp256k1.lock,
    'Secp256k1',
    '0x11',
  ],
  expected: {
    version: '0x0',
    cellDeps: [
      {
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        depType: 'depGroup',
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
    ],
    outputs: [
      {
        capacity: '0x3d',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x60ed0599d4a5c67fd25277243ac12b9f91517b61',
        },
      },
      {
        capacity: '0x34e62cdb9',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        },
      },
    ],
    witnesses: [{ lock: '', inputType: '', outputType: '' }],
    outputsData: ['0x11', '0x'],
  },
};

export const generateKeccakTxFixture = {
  params: [
    aliceAddresses.secp256k1.address,
    'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8kenl3uxcxs6nvasjwphh2hz4cdud4ewxenelac',
    '61',
    '10',
    aliceAddresses.secp256k1.lock,
    'Secp256k1',
    '0x11',
  ],
  expected: {
    version: '0x0',
    cellDeps: [
      {
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        depType: 'depGroup',
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
    ],
    outputs: [
      {
        capacity: '0x3d',
        lock: {
          hashType: 'type',
          codeHash: '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
          args: '0xdb33fc786c1a1a9b3b093837baae2ae1bc6d72e3',
        },
      },
      {
        capacity: '0x34e62cdb9',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        },
      },
    ],
    witnesses: [{ lock: '', inputType: '', outputType: '' }],
    outputsData: ['0x11', '0x'],
  },
};

const fromKeccakToSecp256k1 = {
  version: '0x0',
  cellDeps: [
    {
      outPoint: {
        txHash: '0x57a62003daeab9d54aa29b944fc3b451213a5ebdf2e232216a3cfed0dde61b38',
        index: '0x0',
      },
      depType: 'code',
    },
  ],
  headerDeps: [],
  inputs: [
    {
      previousOutput: {
        txHash: '0x3aa0b7010cec6632236a95e239e8e455b374ef347a9a55b7ed160f0bb1617088',
        index: '0x0',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0xb9f0b47403654f471f7299f2cc51a5cc68c7b78b158d87f401fddf95a73d7277',
        index: '0x0',
      },
      since: '0x0',
    },
  ],
  outputs: [
    {
      capacity: '0x2540be400',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x60ed0599d4a5c67fd25277243ac12b9f91517b61',
      },
    },
    {
      capacity: '0x2540bd400',
      lock: {
        hashType: 'type',
        codeHash: '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
        args: '0x2a2c9c90709c0a4e10bbc68c36d20a98d375c970',
      },
    },
  ],
  witnesses: [{ lock: '', inputType: '', outputType: '' }, '0x'],
  outputsData: ['0x', '0x'],
};
export const generateAnyPayTxFixture = {
  params: [
    aliceAddresses.secp256k1.address,
    'ckt1qyqxpmg9n822t3nl6ff8wfp6cy4ely230dss74qff7',
    '61',
    '10',
    aliceAddresses.secp256k1.lock,
    'Secp256k1',
    'Secp256k1',
  ],
  expected: {
    version: '0x0',
    cellDeps: [
      {
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        depType: 'depGroup',
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
        capacity: '0x34e62ce3d',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x60ed0599d4a5c67fd25277243ac12b9f91517b61',
        },
      },
      {
        capacity: '0x34e62cdb9',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        },
      },
    ],
    witnesses: ['0x', { lock: '', inputType: '', outputType: '' }],
    outputsData: ['0x', '0x'],
  },
};

export const genDummyTransactionFixture = {
  params: [
    aliceAddresses.secp256k1.address,
    'ckt1qyqxpmg9n822t3nl6ff8wfp6cy4ely230dss74qff7',
    '61',
    '10',
    aliceAddresses.secp256k1.lock,
    'Secp256k1',
  ],
  expected: {
    version: '0x0',
    cellDeps: [
      {
        outPoint: {
          txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        depType: 'depGroup',
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
    ],
    outputs: [
      {
        capacity: '0x3d',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x60ed0599d4a5c67fd25277243ac12b9f91517b61',
        },
      },
      {
        capacity: '0x34e62cdb9',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        },
      },
    ],
    witnesses: [{ lock: '', inputType: '', outputType: '' }],
    outputsData: ['0x', '0x'],
  },
};

export const sendTransactionFixture = {
  params: [
    aliceAddresses.secp256k1.address,
    'ckt1qyqxpmg9n822t3nl6ff8wfp6cy4ely230dss74qff7',
    '61',
    '10',
    aliceAddresses.secp256k1.lock,
    'Secp256k1',
    'aaaaaa',
    '0x11',
  ],
  expected: {
    fee: '0a',
    txHash: '0x123',
  },
};
