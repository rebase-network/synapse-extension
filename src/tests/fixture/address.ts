export const bobAddresses = {
  secp256k1: {
    address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    amount: 0,
    lock: '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2',
    type: 'Secp256k1',
  },
  keccak256: {
    address:
      'ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs3s7nwu6x3pnl82rz3xmqypfhcway723ngkutufp',
    amount: 0,
    lock: '0x588ab92ffb902db6b79a764eeff08ce100641a5d4bea3cfabca28d714f473f5c',
    type: 'Keccak256',
  },
  anyPay: {
    address:
      'ckt1qnfkjktl73ljn77q637judm4xux3y59c29qvvu8ywx90wy5c8g34fxuy3pat96shpxvvl7vf2e6ae55u6fk5662x6qh',
    amount: 0,
    lock: '0xe62614824238abd2a0f042598636524801bbcf36acf551b88a657e08d5229ed6',
    type: 'AnyPay',
  },
  publicKey: '0x03d3319a7a7b8b88747664ca9559ab21e746452e8ed5eddc2f4365a1a9157e9ca2',
  args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
  privateKey: '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
};

export const aliceAddresses = {
  secp256k1: {
    address: 'ckt1qyq9cr42u5jaflpwqjck9jz09pkl65d0gqpqegf6k5',
    amount: 0,
    lock: '0xaef10fd7479757aeb519eff422ea29092652f579150105d67ea662023730e1f6',
    type: 'Secp256k1',
    script: {
      args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type',
    },
  },
  keccak256: {
    address:
      'ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs3265p7kw6n5qazw49s7tlxjag86ayprtxqrjh5a',
    amount: 0,
    lock: '0x91c4937774ebc45818020f43e5ef196f46dc7e44cab1f7b132c83ff43a4f7d92',
    type: 'Keccak256',
    script: {
      args: '0xab540faced4e80e89d52c3cbf9a5d41f5d2046b3',
      codeHash: '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
      hashType: 'type',
    },
  },
  anyPay: {
    address:
      'ckt1qnfkjktl73ljn77q637judm4xux3y59c29qvvu8ywx90wy5c8g34ghqw4tjjt48u9cztzckgfu5xml234aqqytl9we7',
    amount: 0,
    lock: '0xaee8cbe64f011979fc7543f825abd68f8c1c89a19139983973ccac706af1eb4e',
    type: 'AnyPay',
    script: {
      args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
      codeHash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
      hashType: 'type',
    },
  },
  publicKey: '0x0390518e809be027269b464734ed7315959729b3f9dd6bc06572745c6d65182623',
  args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
  privateKey: '0x14cfae84c716f895952634c240db80ba00b11032e5ac9fd1663e3a7233c7d80e',
};

export const aliceAddressesListInStorage = {
  addresses: [
    {
      amount: 0,
      lock: '0xaef10fd7479757aeb519eff422ea29092652f579150105d67ea662023730e1f6',
      lockHash: '0xaef10fd7479757aeb519eff422ea29092652f579150105d67ea662023730e1f6',
      script: {
        args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        hashType: 'type',
      },
      type: 'Secp256k1',
    },
    {
      amount: 0,
      lock: '0xd558a67bfecc9d770f32396f25252aff099a6dde1d5bd9a242f145dce90f5957',
      lockHash: '0xd558a67bfecc9d770f32396f25252aff099a6dde1d5bd9a242f145dce90f5957',
      script: {
        args: '0xab540faced4e80e89d52c3cbf9a5d41f5d2046b3',
        codeHash: '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
        hashType: 'type',
      },
      type: 'Keccak256',
    },
    {
      amount: 0,
      lock: '0xaee8cbe64f011979fc7543f825abd68f8c1c89a19139983973ccac706af1eb4e',
      lockHash: '0xaee8cbe64f011979fc7543f825abd68f8c1c89a19139983973ccac706af1eb4e',
      script: {
        args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
        codeHash: '0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354',
        hashType: 'type',
      },
      type: 'AnyPay',
    },
  ],
  publicKey: '0x0390518e809be027269b464734ed7315959729b3f9dd6bc06572745c6d65182623',
};

export const aliceWallet = {
  entropyKeystore: '',
  keystore:
    '{"data":"8S/gbtiyjFYpQKwSG9fDZUJga+adVC0iBr3q7tQMhI4M0f6LZUPdxRL2P7jN/Qf/VBY1wFcKmE3oFInc6C2SHUY+TI1+IH4hqDcGmsAMd1tj3Gl7PjfQYgkVisP+9SAOQrYBfvcSA+9jh721b9qknaICH7LwO3B2LI0/LaJ6laU43C6hODJoiMrHVhMyKq6aSwyL5dKJefu2NCS35A==","iv":"5AcdqtHlQJeUROVzuo+/FA==","salt":"TF2qk4O7ongXFZoz8JCGXtZaVPA4D/BkT0iCJrUxfWw="}',
  keystoreType: '3',
  publicKey: '0x0390518e809be027269b464734ed7315959729b3f9dd6bc06572745c6d65182623',
  rootKeystore: '',
};

export const aliceWalletInStorage = {
  publicKey: '0x0390518e809be027269b464734ed7315959729b3f9dd6bc06572745c6d65182623',
  type: 'Secp256k1',
  script: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: '0x5c0eaae525d4fc2e04b162c84f286dfd51af4002',
  },
  lock: '0xaef10fd7479757aeb519eff422ea29092652f579150105d67ea662023730e1f6',
  lockHash: '0xaef10fd7479757aeb519eff422ea29092652f579150105d67ea662023730e1f6',
};

export const aliceWalletPwd = 'aaaaaa';

export const walletCellAddresses = {
  secp256k1: {
    address: 'ckt1qyqvu6y3t8j8u3s86feug0vc8dnr4pwznnaq3d8zwv',
    amount: 0,
    lock: '0x3eb162f222d8b4511331621e7a1a07142a056d76d48e3efabb6369fdb04bf052',
    type: 'Secp256k1',
  },
  keccak256: {
    address:
      'ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs30662plxq5705sfzjq4xvvh656nt403ws8hft7l',
    amount: 0,
    lock: '0x37d363ab5933d539cd11b9d29c0ce7d2fbee222b1271277b88f42a5fc24b4646',
    type: 'Keccak256',
  },
  anyPay: {
    address:
      'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhnngj9v7gljxqlf883panqakvw59c2w05a7w24x',
    amount: 0,
    lock: '0xd173376583583539886625fd6e178098e51bac266fa94667732d485164cf4f19',
    type: 'AnyPay',
  },
  publicKey: '0x02823d83ffca3ad1a9383cbb9dad7b72c7c3f6d547c69017e64f43cbea4563a511',
  args: '0xce689159e47e4607d273c43d983b663a85c29cfa',
  privateKey: '0x975188feb6636230f5b02aa9e9e83c318a4c4d717aa5683ec352c7d350c2cc38',
};
