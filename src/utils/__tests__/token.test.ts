import { aggregateUDT, UDTInfo } from '../token';
import fixture from '../fixtures/token';

describe('utils: token', () => {
  it('should aggregate udts correctly', () => {
    const result = aggregateUDT(fixture.tokens.udts as UDTInfo[]);
    expect(result).toEqual(fixture.udtInfo);
  });
});
