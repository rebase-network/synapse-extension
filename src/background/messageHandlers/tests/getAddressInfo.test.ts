import currentWallet from './fixtures/currentWallet';
import getAddressInfo from '../getAddressInfo';

jest.mock('@utils/apis');

describe('getAddressInfo', () => {
  it('should able to get address info', async () => {
    await browser.storage.local.set({
      currentWallet,
    });
    const port = {
      postMessage: (message) => {
        expect(message).not.toBeNull();
      },
    };
    getAddressInfo(port);
  });
});
