import { textToHex, textToBytesLength, parseSUDT } from '../index';

describe('utils', () => {
  it('textToHex', () => {
    const result = textToHex('abc');
    expect(result).toEqual('0x616263');
  });

  it('textToHex', () => {
    const result = textToHex('0x123');
    expect(result).toEqual('0x123');
  });

  it('textToBytesLength', () => {
    const result = textToBytesLength('abc');
    expect(result).toEqual(3);
  });

  it('should be able to parse sUDT amount', () => {
    const outputData = '10270000000000000000000000000000';
    const udtAmount = parseSUDT(outputData);
    const udtAmountSame = parseSUDT(`0x${outputData}`);
    expect(udtAmount).toBe(10000);
    expect(udtAmountSame).toBe(10000);
  });
});
