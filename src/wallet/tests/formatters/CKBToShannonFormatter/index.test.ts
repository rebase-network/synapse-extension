import { CapacityUnit } from '@utils/constants';
import { CKBToShannonFormatter } from '../../../formatters';
import fixtures from './fixtures';

const fixtureTable: [
  string,
  CapacityUnit,
  string,
][] = fixtures.map(({ ckb: { amount, unit }, expected }) => [amount, unit, expected]);

describe('Verify CKB to Shannons formatter', () => {
  test.each(fixtureTable)(
    '%s %s => %s shannons',
    (amount: string, unit: CapacityUnit, expected: string) => {
      expect(CKBToShannonFormatter(amount, unit)).toBe(expected);
    },
  );
});
