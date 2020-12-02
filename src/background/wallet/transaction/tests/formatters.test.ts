import { ckbToshannon } from '@src/common/utils/formatters';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Formatter Test', () => {
  it('test capacity value', () => {
    const capacity = '0.0003';
    const result = ckbToshannon(Number(capacity));
    expect(result).toBe(BigInt(30000));
  });
});
