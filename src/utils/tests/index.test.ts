import { parseSUDT } from '../index';

describe('utils', () => {
  it('should be able to parse sUDT amount', () => {
    const outputData = '10270000000000000000000000000000';
    const udtAmount = parseSUDT(outputData);
    const udtAmountSame = parseSUDT(`0x${outputData}`);
    expect(udtAmount).toBe(10000);
    expect(udtAmountSame).toBe(10000);
  });
});
