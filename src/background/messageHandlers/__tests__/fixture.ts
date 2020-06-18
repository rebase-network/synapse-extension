const rawTx = {
  version: '0x0',
  cellDeps: [
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
        txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
        index: '0x0',
      },
    },
  ],
  headerDeps: [],
  inputs: [
    {
      since: '0x0',
      previousOutput: {
        txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
        index: '0x1',
      },
    },
  ],
  outputs: [
    {
      capacity: '0x34e62ce00',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
      },
      type: {
        hashType: 'data',
        codeHash: '0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869',
        args: '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2',
      },
    },
    {
      capacity: '0x2bb8a24afc0',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
      },
      type: null,
    },
  ],
  outputsData: ['0x40420f00000000000000000000000000', '0x'],
  witnesses: [
    {
      lock: '',
      inputType: '',
      outputType: '',
    },
  ],
};

const rawTxWithMeta = {
  meta: {
    from: 'ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn',
    to: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    capacity: 100,
    data: '0x68656c6c6f20636b62 ',
  },
  tx: rawTx,
};

export { rawTx, rawTxWithMeta };
