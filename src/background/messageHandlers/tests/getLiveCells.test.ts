import currentWallet from './fixtures/currentWallet';
import getLiveCells from '../getLiveCells';

jest.mock('@utils/apis');

describe('getLiveCells', () => {
  it('should able to get live cells', async () => {
    await browser.storage.local.set({
      currentWallet,
    });
    const port = {
      postMessage: (message) => {
        expect(message).not.toBeNull();
      },
    };
    const data = {
      lockHash: currentWallet.lock,
    };
    getLiveCells(port, data);
  });
});
