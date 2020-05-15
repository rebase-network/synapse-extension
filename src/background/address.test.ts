import { getAddressInfo } from './address';

describe('address util test', () => {
  it('should return value for address balance', async () => {
    const address = 'ckt1qyq02llz4hpvl3sz9wkmt7qqh0397x2cdegsem7ykn';
    const balance = await getAddressInfo(address);
    expect(balance).toBeGreaterThan(100);
  });
});
