import { getAddressInfo } from '@utils/apis';

jest.mock('@utils/apis');

describe('address util test', () => {
  it('should return value for address balance', async () => {
    const address = 'ckt1qyq02llz4hpvl3sz9wkmt7qqh0397x2cdegsem7ykn';
    const addressInfo = await getAddressInfo(address);
    expect(typeof addressInfo.capacity).toEqual('string');
  });
});
