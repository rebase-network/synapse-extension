import { rawTx } from '@common/fixtures/tx';
import calculateTxFee from './calculateFee';

describe('calculateTxFee', () => {
  it('should calculate Tx Fee', () => {
    const result = calculateTxFee(rawTx);
    expect(result).toEqual('0x6db');
  });
});
