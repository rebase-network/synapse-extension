const fixtures = [
  {
    value: {
      shannons: '1234567890',
      unit: 'Unknown',
      exchange: '0.000000001',
    },
    expected: '1.23456789 Unknown',
  },
  {
    value: {
      shannons: '1234567890',
      unit: 'CKB',
      exchange: '0.000000001',
    },
    expected: '1.23456789 CKB',
  },
  {
    value: {
      shannons: '1234567890',
      unit: 'CKB',
      exchange: '0.00065',
    },
    expected: '802,469.1285 CKB',
  },
  {
    value: {
      shannons: '1234567890',
      unit: 'CNY',
      exchange: '0.00065',
    },
    expected: '802,469.1285 CNY',
  },
  {
    value: {
      shannons: '1234567890123456789012345678901234567890123456789012345678901234567890',
      unit: 'CNY',
      exchange: '0.65',
    },
    expected:
      '802,469,128,580,246,912,858,024,691,285,802,469,128,580,246,912,858,024,691,285,802,469,128.5 CNY',
  },
  {
    value: {
      shannons: '12345678901234567890123456789012345678901234567890123456789012345678901234',
      unit: 'CNY',
      exchange: '0.65',
    },
    expected:
      '8,024,691,285,802,469,128,580,246,912,858,024,691,285,802,469,128,580,246,912,858,024,691,285,802.1 CNY',
  },
];
export default fixtures;
