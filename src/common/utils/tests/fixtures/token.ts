import _ from 'lodash';

const eightDecimals = 10 ** 8;
const CKBWithOneUDT = 142 * eightDecimals;
const CKBWithOneUDTStr = String(CKBWithOneUDT);
// 10**8
const eightDecimalsLittleEndian = '0x00e1f505000000000000000000000000';

const CKBWithDataCellsNum = 10;
const unknownUDTOneCellsNum = 10;
const unknownUDTTwoCellsNum = 10;
const SNBCellsNum = 20;
const TLTCellsNum = 20;

const CKBWithDataCellTypeHash = null;

const unknownUDTOneTypeHash = '0xe3be4fb98ec914886c6525abac97e1f8769c59492636a1d35955e9163ef46efa';

const unknownUDTTwoTypeHash = '0x1f1bf5dde941e0bc384defcd2c7f139f59082f735cdea7c2625f77c680f4644a';

const SNBTypeHash = '0x1c5f32c5efb08ac256bd9413c30eef7420ae54f30ff11075967b89570326c295';

const TLTTypeHash = '0x663265381e55af0f9789d2b0c9bd38525358b40c29bd6254c0b0c9b2926c6844';

const CKBWithDataCell = {
  typeHash: CKBWithDataCellTypeHash,
  capacity: CKBWithOneUDTStr,
  outputdata: eightDecimalsLittleEndian,
  type: null,
};

const CKBWithDataCells = _.times(CKBWithDataCellsNum, () => CKBWithDataCell);

const unknownUDTOneCell = {
  typeHash: unknownUDTOneTypeHash,
  capacity: CKBWithOneUDTStr,
  outputdata: eightDecimalsLittleEndian,
  type: {
    args: '0x94bbc8327e16d195de87815c391e7b9131e80419c51a405a0b21227c6ee05129',
    codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    hashType: 'data',
  },
};

const unknownUDTOneCells = _.times(unknownUDTOneCellsNum, () => unknownUDTOneCell);

const unknownUDTTwoCell = {
  typeHash: unknownUDTTwoTypeHash,
  capacity: CKBWithOneUDTStr,
  outputdata: eightDecimalsLittleEndian,
  type: {
    args: '0x53d22825d8e8e0057b43c6dfb57133e054db159a2497c81e78a9dfbcdba0208f',
    codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    hashType: 'data',
  },
};

const unknownUDTTwoCells = _.times(unknownUDTTwoCellsNum, () => unknownUDTTwoCell);

const SNBCell = {
  typeHash: SNBTypeHash,
  capacity: CKBWithOneUDTStr,
  outputdata: eightDecimalsLittleEndian,
  type: {
    args: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
    codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    hashType: 'data',
  },
};

const SNBCells = _.times(SNBCellsNum, () => SNBCell);

const TLTCell = {
  typeHash: TLTTypeHash,
  capacity: CKBWithOneUDTStr,
  outputdata: eightDecimalsLittleEndian,
  type: {
    args: '0x5f77c1d1a0e384d5c7d7c02788b51e0a296d4ec13cd7b66bb16f1650ebbfd74c',
    codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    hashType: 'data',
  },
};

const TLTCells = _.times(TLTCellsNum, () => TLTCell);

export const udtsLiveCells = [
  ...SNBCells,
  ...TLTCells,
  ...CKBWithDataCells,
  ...unknownUDTOneCells,
  ...unknownUDTTwoCells,
];

// aggregate result from tokens
export const udtsCapacity = {
  // SNB
  [SNBTypeHash]: {
    ckb: CKBWithOneUDT * SNBCellsNum,
    udt: eightDecimals * SNBCellsNum,
  },
  // TLT
  [TLTTypeHash]: {
    ckb: CKBWithOneUDT * TLTCellsNum,
    udt: eightDecimals * TLTCellsNum,
  },
  [CKBWithDataCellTypeHash]: {
    ckb: CKBWithOneUDT * CKBWithDataCellsNum,
    udt: 0,
  },

  [unknownUDTOneTypeHash]: {
    ckb: CKBWithOneUDT * unknownUDTOneCellsNum,
    udt: eightDecimals * unknownUDTOneCellsNum,
  },
  [unknownUDTTwoTypeHash]: {
    ckb: CKBWithOneUDT * unknownUDTTwoCellsNum,
    udt: eightDecimals * unknownUDTTwoCellsNum,
  },
};

export const udtsMeta = [
  {
    name: 'Love Lina Token',
    symbol: 'TLT',
    decimal: 8,
    typeHash: TLTTypeHash,
  },
  {
    name: 'SuperNewToken',
    decimal: 4,
    symbol: 'SNB',
    typeHash: SNBTypeHash,
  },
];

export const addressInfo = {
  lockHash: '0x6e842ebb7d7fca88495c5f2edb05070198f6f8c798d7b8f1a48226f8f060c693',
  lockScript: {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    args: '0x58b7c258acf8e3c65210561bd4b4c57eb0ffde27',
    hashType: 'type',
  },
};

export const explorerUrl = 'https://explorer.nervos.org/aggron';

export default {
  addressInfo,
  udtsLiveCells,
  udtsCapacity,
  udtsMeta,
};
