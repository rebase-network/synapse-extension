describe('Transaction test: secp256k1', () => {
  function hex_data_occupied_bytes(hex_string) {
    // Exclude 0x prefix, and every 2 hex digits are one byte
    return (hex_string.length - 2) / 2;
  }

  function script_occupied_bytes(script) {
    if (script !== undefined && script !== null) {
      return 1 + hex_data_occupied_bytes(script.code_hash) + hex_data_occupied_bytes(script.args);
    }
    return 0;
  }

  function cell_occupied_bytes(cell) {
    return (
      8 +
      //   hex_data_occupied_bytes(cell.data) +
      script_occupied_bytes(cell.lock) +
      script_occupied_bytes(cell.type)
    );
  }

  it('cell_occupied_bytes test', async () => {
    // console.log(
    //   cell_occupied_bytes({
    //     capacity: '4500000000',
    //     data: '0x72796c6169',
    //     lock: {
    //       args: '0x',
    //       hash_type: 'data',
    //       code_hash: '0xb35557e7e9854206f7bc13e3c3a7fa4cf8892c84a09237fb0aab40aab3771eee',
    //     },
    //     type: null,
    //   }),
    // );

    console.log(
      cell_occupied_bytes({
        capacity: '0xe8754318',
        lock: {
          hash_type: 'type',
          code_hash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
          args: '0x85e5401c52aece9eb614f997b2f2c20f9fc10a67',
        },
        type: null,
      }),
    );
  });
});
