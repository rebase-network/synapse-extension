import { aggregateUDT, UDTInfo } from '../token';
import { udtsLiveCells, udtsCapacity } from './fixtures/token';

describe('utils: token', () => {
  it('should aggregate udts correctly', () => {
    const result = aggregateUDT(udtsLiveCells as UDTInfo[]);
    expect(result).toEqual(udtsCapacity);
  });
});
