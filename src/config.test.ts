import config from './config';

describe('config', () => {
  it('should have config', () => {
    expect(typeof config.CKB_RPC_ENDPOINT).toBe('string');
    expect(typeof config.CACHE_LAYER_ENDPOINT).toBe('string');
    expect(typeof config.CKB_RPC_ENDPOINT_MAINNET).toBe('string');
    expect(typeof config.CACHE_LAYER_ENDPOINT_MAINNET).toBe('string');
    expect(typeof config.isProduction).toBe('boolean');
  });
});
