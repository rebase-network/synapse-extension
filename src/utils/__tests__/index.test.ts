import { hexToDecimal } from '../index';

describe('utils', () => {
  it('hexToDecimal should convert little endian hex to decimal', () => {
    const hexStr = '10270000000000000000000000000000';
    const decimal = hexToDecimal(hexStr, false);
    const decimalSame = hexToDecimal(`0x${hexStr}`, false);
    expect(decimal).toBe(10000);
    expect(decimalSame).toBe(10000);
  });
});
