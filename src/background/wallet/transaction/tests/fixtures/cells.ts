import { TypesInfo } from '@common/utils/constants/typesInfo';

const unspentCells = [
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
      hashType: TypesInfo.testnet.simpleudt.hashType,
      codeHash: TypesInfo.testnet.simpleudt.codeHash,
      args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
    },
    typeHash: '0x1c5f32c5efb08ac256bd9413c30eef7420ae54f30ff11075967b89570326c295',
    dataHash: '0x85b991d8b373274224b781301765cddd366959acf294f58f56bb56ed5b695516',
    status: 'live',
  },
];

export default unspentCells;
