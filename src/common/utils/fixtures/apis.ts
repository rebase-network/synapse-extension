export const udtUnspentCells = [
  {
    blockHash: '0x49e71fde5904f67005b72712b49ddf52a97a7abe10bd5183c31f8b3a5d936121',
    lock: {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type',
      args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
    },
    lockHash: '0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b',
    outPoint: {
      txHash: '0x37063697f29aaa185cb971ce658872eebdee419f3389ab746674c65c9b8a96b6',
      index: '0x1',
    },
    outputData: '0x449b2c00000000000000000000000000',
    outputDataLen: '0x10',
    capacity: '0x34e62ce00',
    type: {
      codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
      hashType: 'data',
      args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
    },
    typeHash: '0x1c5f32c5efb08ac256bd9413c30eef7420ae54f30ff11075967b89570326c295',
    dataHash: '0x85b991d8b373274224b781301765cddd366959acf294f58f56bb56ed5b695516',
    status: 'live',
  },
];

export const getUDTsByLockHashFixture = {
  udts: [
    { typeHash: null, capacity: '7100000000', outputdata: '0x68656c6c6f20636b627e', type: null },
    {
      typeHash: null,
      capacity: '8400000000',
      outputdata: '0x49206c6f766520434b4220616e642053796e617073657e',
      type: null,
    },
    {
      typeHash: '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301',
      capacity: '14200000000',
      outputdata: '0x10270000000000000000000000000000',
      type: {
        args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x0f94d4664db6520c364f8e6b02b152a00c2c0562c70df87ae65950d9f7178e8e',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0xd601164e020000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0xb9a937ae8dba78ebd07b1eec18879f7b6662d6bd8574bb59e7edf17dabe5cd13',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00e1f505000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x99a25cc0e791837bf4e8755029c85a4d20ea4e3da2eb234360bbafd39485d843',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00e1f505000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x7f528438d0049c69824c669a014d0c8b95f868a9c84aded12bc3872a4f29131d',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00e1f505000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x55293570953ecd7a97269d994a5c03c7ae60c4371262934e5c0d387baf636b1c',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00c2eb0b000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x78bfca646b6d162eafc89e97d89bcf174edfc3d6d7116d16b9f5761e43b17f39',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00e1f505000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x40f6ddf5e3a2f0ce9a9ad258a1b4cdeaddf8af2ba764b72213cad5f3218093ae',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00e1f505000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x0ddc8d41dad31c4edc80ab6a511c02b40ad14a64a4d6d9a23641099d7bcb9ab2',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00a3e111000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0x3bfc3324eb6f14287f1a23d8c8871526c0c1ea08e585231a5af1cc76425dc29b',
      index: '0x0',
    },
    {
      typeHash: '0x7abd58773ffee5866ffd30cd287e88f8139dd0cad5deb9e189c68b4b26bf9899',
      capacity: '14200000000',
      outputdata: '0x00c2eb0b000000000000000000000000',
      type: {
        args: '0x0466a2e7b55dad9353271614ca3a1b6016d3c6b69e3239c6ba7e37ef1bbe0a0e',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0xd2aafe2b653483848c718ce47f00f010244c30b2ae29921f1d186ff5888720cb',
      index: '0x0',
    },
    { typeHash: null, capacity: '6600000000', outputdata: '0x68656c6c6f', type: null },
    { typeHash: null, capacity: '6900000000', outputdata: '0x68656c6c6f313233', type: null },
    { typeHash: null, capacity: '6700000000', outputdata: '0x686569686569', type: null },
    { typeHash: null, capacity: '6400000000', outputdata: '0x313233', type: null },
    {
      typeHash: null,
      capacity: '7300000000',
      outputdata: '0x746573742061616162626262',
      type: null,
    },
    {
      typeHash: '0x1c5f32c5efb08ac256bd9413c30eef7420ae54f30ff11075967b89570326c295',
      capacity: '14200000000',
      outputdata: '0x34742c00000000000000000000000000',
      type: {
        args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0xbf3c9c22fbadbe642a0783eadbd734a62b042046c8ee3dbb0eff4b7dad6e37b9',
      index: '0x1',
    },
    {
      typeHash: '0x1c5f32c5efb08ac256bd9413c30eef7420ae54f30ff11075967b89570326c295',
      capacity: '14200000000',
      outputdata: '0x10270000000000000000000000000000',
      type: {
        args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        hashType: 'data',
      },
      txHash: '0xbf3c9c22fbadbe642a0783eadbd734a62b042046c8ee3dbb0eff4b7dad6e37b9',
      index: '0x0',
    },
  ],
  capacity: '157799488891',
};
