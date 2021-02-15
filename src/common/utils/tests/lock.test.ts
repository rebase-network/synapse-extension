import lockUtils from '../lock';
import locksInfo from '../constants/locksInfo';

describe('lock utils', () => {
  it('should know if it is anypay script', () => {
    const result = lockUtils.isAnypay(locksInfo.mainnet.anypay.codeHash);
    expect(result).toBeTruthy();
  });
});
