import NetworkManager from '@common/networkManager';
import { getDepFromLockType } from '../deps';

describe('deps', () => {
  it('getDepFromLockType', async () => {
    await NetworkManager.initNetworks();
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

  it('getDepFromLockType with error', async () => {
    const network = {
      networkType: 'notSupport',
    };
    await browser.storage.local.set({
      networks: [network],
      currentNetwork: network,
    });
    expect(getDepFromLockType('Secp256k1', NetworkManager)).rejects.toEqual(
      new Error('Network is not supported'),
    );
  });
});
