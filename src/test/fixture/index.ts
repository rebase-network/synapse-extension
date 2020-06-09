const fixture = {
  transactionHash: '0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead',
  previousOutputHash: '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2',
  expectTransaction: {
    transaction: {
      cellDeps: [
        {
          outPoint: {
            txHash: '0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e',
            index: '0x0',
          },
          depType: 'depGroup',
        },
      ],
      inputs: [
        {
          previousOutput: {
            txHash: '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2',
            index: '0x1',
          },
          since: '0x0',
        },
      ],
      outputs: [
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0xcd09786388eb48e0d1b616d7964945f1a86e9a44',
          },
          type: null,
          capacity: '0x746a528800',
        },
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0x3f1573b44218d4c12a91919a58a863be415a2bc3',
          },
          type: null,
          capacity: '0xb897513e30028b7',
        },
      ],
      outputsData: ['0x', '0x'],
      headerDeps: [],
      hash: '0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead',
      version: '0x0',
      witnesses: [
        '0x55000000100000005500000055000000410000003afb8365b489a78d88e5b3cddc856784e251deea0a6e041201b9a73d22e1c0c353141a821b3c119b52272e1b570b0f3be2b461c0477e95aca6d405929ab88ef601',
      ],
    },
    txStatus: {
      blockHash: '0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f',
      status: 'committed',
    },
  },
  previousOutputTX: {
    transaction: {
      cellDeps: [
        {
          outPoint: {
            txHash: '0x6495cede8d500e4309218ae50bbcadb8f722f24cc7572dd2274f5876cb603e4e',
            index: '0x0',
          },
          depType: 'depGroup',
        },
      ],
      inputs: [
        {
          previousOutput: {
            txHash: '0xaf63a8d26cb30f7645181bdcb3e8e370616e810f57817aa03da70240c07199f8',
            index: '0x1',
          },
          since: '0x0',
        },
      ],
      outputs: [
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0x6760d44c3d9ed372d109309ed180535c7625994b',
          },
          type: null,
          capacity: '0x746a528800',
        },
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0x3f1573b44218d4c12a91919a58a863be415a2bc3',
          },
          type: null,
          capacity: '0xb8975884d52b2eb',
        },
      ],
      outputsData: ['0x', '0x'],
      headerDeps: [],
      hash: '0x596272422eea6328082a319ca7d9f4502f7ce5f6d34ea8bbb977f8c1bbca83b2',
      version: '0x0',
      witnesses: [
        '0x5500000010000000550000005500000041000000fd079be56223be0661a6d5bbe34ad2f3820975000391b301b9ab994a5e0d767910e40cadbb2fd66ae1daf8d196a10afd77856daf643a6b0012b889c7fc71080301',
      ],
    },
    txStatus: {
      blockHash: '0xf939f366beb749cdb95c7b6c719c800f49d0be25ab4a29043884fc5e763e20ad',
      status: 'committed',
    },
  },

  expectBlockHash: '0x6335afbe6394a38a61f6f8b9a93067b06e25aa2dd5e8f02c9f3431b9209b971f',
  expectStatus: 'committed',
  expectlockHash: '0x9cb0bfa5cc9d53775c677c6e4f35e90bd8a65923fb691f1895455cb48f0241f1',
};

export const secp256k1 = {
  privateKey: '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
  address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
  type: 'Secp256k1',
  lock: '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2',
  amount: 0,
  lockScript: {
    hashType: 'type',
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
  },
};

export const anyonepay = {
  privateKey: '0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
  address:
    'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyhxuy3pat96shpxvvl7vf2e6ae55u6fk564sc527',
  type: 'AnyPay',
  lock: '0x6af8c2199802665ea2a8ed85b087b1ac26b47b332dfe7322c6b34e38f1a2f129',
  amount: 0,
  lockScript: {
    hashType: 'type',
    codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
    args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
  },
};

export const keccak256 = {
  address:
    'ckt1qjjm395fg5uc986703vs9uqzw5gljnrslgjqd4gfulrdrhmkkphs3s7nwu6x3pnl82rz3xmqypfhcway723ngkutufp',
  type: 'Keccak256',
  lock: '0x588ab92ffb902db6b79a764eeff08ce100641a5d4bea3cfabca28d714f473f5c',
  amount: 0,
  lockScript: {
    hashType: 'type',
    codeHash: '0x7783e303a1945ba9df86f0bc2cc1543a0992747954f3d3170cec08e1bcce6d8b',
    args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
  },
};

export default fixture;
