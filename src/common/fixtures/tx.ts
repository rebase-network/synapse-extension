import { aliceAddresses } from '@src/test/fixture/address';
// https://explorer.nervos.org/aggron/transaction/0x44f543d59974cb9dac09323008a162beebaa19e6d7d0dbf91507947f678e612c

// use alice's address rather than the real one
const { privateKey } = aliceAddresses;

const config = { index: 3, length: 2 };

const message = '0x32d4365e154c064dac98ff272941be0fc716765a284c931d9a07a1fafec83dc5';

const signedMessageBeforeSerialize =
  '0x02bd47677087bd6056f2dd3737249d6c475acbe425dc7d34c97dbab434086d9d4db14676ebd29a8c392ae61291f3ee89d1a00f8792e6b51cc881d8bf5280ac7200';

const signedMessage =
  '0x550000001000000055000000550000004100000002bd47677087bd6056f2dd3737249d6c475acbe425dc7d34c97dbab434086d9d4db14676ebd29a8c392ae61291f3ee89d1a00f8792e6b51cc881d8bf5280ac7200';

const rawTx: CKBComponents.RawTransactionToSign = {
  cellDeps: [
    {
      depType: 'depGroup',
      outPoint: {
        txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
        index: '0x0',
      },
    },
    {
      depType: 'code',
      outPoint: {
        txHash: '0x809e977a2537b181aeef4b6bbc4cfd4e5d9dbd699aa836a1549089016ccee455',
        index: '0x0',
      },
    },
    {
      depType: 'code',
      outPoint: {
        txHash: '0x7fc297edbb7bef34343d4449bf04813cf6a12c3873c83da20d31f8e402ee9f75',
        index: '0x0',
      },
    },
    {
      depType: 'code',
      outPoint: {
        txHash: '0x8dab22e2507dbcc90693d2a6d4beebfcc320f72b3e05ca1473f627b942955c73',
        index: '0x0',
      },
    },
  ],

  headerDeps: [],

  inputs: [
    {
      previousOutput: {
        txHash: '0x4a3f8226f5448c02b5f8d94a17aea546ccad400df144f57bb76aabb5ce9ea0bb',
        index: '0x0',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0x4a3f8226f5448c02b5f8d94a17aea546ccad400df144f57bb76aabb5ce9ea0bb',
        index: '0x1',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0x4a3f8226f5448c02b5f8d94a17aea546ccad400df144f57bb76aabb5ce9ea0bb',
        index: '0x2',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0xd9ec339161532b1786b547d5ed24520d1ed68208f81b1deea56604f5bdb6122e',
        index: '0x5',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0x630486b8061894fa98a1ecc03e135a0361a47f5bdd10a0e1c5df0e3c37a416a6',
        index: '0x4',
      },
      since: '0x0',
    },
  ],

  outputs: [
    {
      capacity: '0x6fc23ac00',
      lock: {
        args:
          '0x00000000000000000000000000000000000000000000000000000000000000009417da44c3f62caa8f514a9aef8153ff8a148d628803d9579b9ddbd0b410cbb3',
        codeHash: '0x66b29f4c99c832d852f5a9c6018dedd6f90a5339f2db71276366fd5faa8173c8',
        hashType: 'type',
      },
      type: {
        args:
          '0x00000000000000000728461320fe9bac472fb4b71984acb4451bc544360cff57d980df25fd80f1b005000000',
        codeHash: '0x9fe22d1defd1f7b765f2b814b2fdb9ba0e9a163bc1f5de0a3364f0ce4a856328',
        hashType: 'type',
      },
    },
    {
      capacity: '0x6fc23df2b',
      lock: {
        args:
          '0x00000000000000000000000000000000000000000000000000000000000000009417da44c3f62caa8f514a9aef8153ff8a148d628803d9579b9ddbd0b410cbb3',
        codeHash: '0x66b29f4c99c832d852f5a9c6018dedd6f90a5339f2db71276366fd5faa8173c8',
        hashType: 'type',
      },
    },
    {
      capacity: '0x47272df00',
      lock: {
        args:
          '0x00000000000000000000000000000000000000000000000000000000000000009417da44c3f62caa8f514a9aef8153ff8a148d628803d9579b9ddbd0b410cbb3',
        codeHash: '0x66b29f4c99c832d852f5a9c6018dedd6f90a5339f2db71276366fd5faa8173c8',
        hashType: 'type',
      },
      type: {
        args: '0xfdc6bb73b0cbb033ffb122b7cd0a5bdec5de445637908239feb4f2e5168a4d09',
        codeHash: '0x8971b3a963e6288868cc0ff81686ae177c7ee315a471298f486ae2074260ff4c',
        hashType: 'type',
      },
    },
    {
      capacity: '0x16b969d00',
      lock: {
        args: '0xa3f81ce386206baf6673217a4ddc70e07b26da14',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      },
    },
    {
      capacity: '0x351e771a33d2',
      lock: {
        args: '0xd310bba5375bda7a2ace4f9a483bd51d12384bd1',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      },
    },
    {
      capacity: '0x16b969d00',
      lock: {
        args: '0xd310bba5375bda7a2ace4f9a483bd51d12384bd1',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      },
    },
    {
      capacity: '0x35458af00',
      lock: {
        args: '0xd310bba5375bda7a2ace4f9a483bd51d12384bd1',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      },
      type: {
        args: '0xfdc6bb73b0cbb033ffb122b7cd0a5bdec5de445637908239feb4f2e5168a4d09',
        codeHash: '0x8971b3a963e6288868cc0ff81686ae177c7ee315a471298f486ae2074260ff4c',
        hashType: 'type',
      },
    },
  ],

  outputsData: [
    '0x2bdf23fc0600000000000000000000005d1d000000000000000000000000000010270000000000000000000000000000',
    '0x',
    '0x5d1d0000000000000000000000000000',
    '0x',
    '0x',
    '0x',
    '0x45050000000000000000000000000000',
  ],

  version: '0x0',

  witnesses: [
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
  ],
};

const rawTxWithMeta = {
  meta: {
    config: { index: 3, length: 2 }, // sign the 4th and 5th of inputs array
  },
  tx: rawTx,
};

const signedWitnesses = [
  {
    inputType: '',
    lock: '',
    outputType: '',
  },
  {
    inputType: '',
    lock: '',
    outputType: '',
  },
  {
    inputType: '',
    lock: '',
    outputType: '',
  },
  // The value will be different depends on the private key to sign. The signed witness position/index should unchange (3)
  signedMessage,
  {
    inputType: '',
    lock: '',
    outputType: '',
  },
];

const signedWitnessesSerialized = [
  '0x10000000100000001000000010000000',
  '0x10000000100000001000000010000000',
  '0x10000000100000001000000010000000',
  // The value will be different depends on the private key to sign. The signed witness position/index should unchange (3)
  signedMessage,
  '0x10000000100000001000000010000000',
];

export {
  rawTx,
  rawTxWithMeta,
  signedWitnesses,
  signedWitnessesSerialized,
  privateKey,
  config,
  message,
  signedMessage,
  signedMessageBeforeSerialize,
};
