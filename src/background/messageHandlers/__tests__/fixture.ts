export const txInfo = {
  meta: {
    from: 'ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn',
    to: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    capacity: 100,
    data: '0x68656c6c6f20636b62 ',
  },
  tx: {
    version: '0x0',
    cellDeps: [
      {
        depType: 'depGroup',
        outPoint: {
          txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
          index: '0x0',
        },
      },
    ],
    headerDeps: [],
    inputs: [
      {
        since: '0x0',
        previousOutput: {
          txHash: '0x5e3d6849c28321c5e8b47b2a6809bff940ffeb45a167b2de7e10d424a350ed95',
          index: '0x0',
        },
      },
    ],
    outputs: [
      {
        capacity: '0x174876e800',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0xf57fe2adc2cfc6022badb5f800bbe25f19586e51',
        },
        type: null,
      },
      {
        capacity: '0x177e1bd100',
        lock: {
          hashType: 'type',
          codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
        },
        type: null,
      },
    ],
    outputsData: ['0x', '0x'],
    witnesses: [
      {
        lock: '',
        inputType: '',
        outputType: '',
      },
    ],
  },
};

export default txInfo;
