import NetworkManager from '@common/networkManager';
import { getDepFromLockType } from '../deps';

describe('deps', () => {
  beforeAll(async () => {
    await NetworkManager.initNetworks();
  });

  it('getDepFromLockType', async () => {
    const result = await getDepFromLockType('Secp256k1', NetworkManager);
    const expected = {
      depType: 'depGroup',
      outPoint: {
        index: '0x0',
        txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      },
    };
    expect(result).toEqual(expected);
  });
});
