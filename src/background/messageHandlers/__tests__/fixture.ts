export const txInfo = {
  meta: {
    from: 'ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn',
    to: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    capacity: 100,
    data: '0x68656c6c6f20636b62 ',
  },
  tx: {
    version: '0x0',
    cell_deps: [
      {
        out_point: {
          tx_hash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
          index: '0x0',
        },
        dep_type: 'dep_group',
      },
    ],
    inputs: [
      {
        previous_output: {
          tx_hash: '0xfe1e35cabdd2c58e3eb6fe71183c1b39cd1145a396380c573bbd8aa9e8a2b4e9',
          index: '0x0',
        },
        since: '0x0',
      },
    ],
    outputs: [
      {
        capacity: '0x19b45a500',
        lock: {
          code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
          hash_type: 'type',
          args: '0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34',
        },
        type: null,
      },
    ],
    outputs_data: ['0x7465737420616161'],
    header_deps: [],
    witnesses: [
      '0x5500000010000000550000005500000041000000fff39ea320780c08e166543ca32b7d868cc2ce0bc5991c605ea1ba8d6b92efc21178b4409fa1270b0c6087a84dc46d1dc783bd7d19f4be49406ef878e4da10e701',
    ],
  },
};
