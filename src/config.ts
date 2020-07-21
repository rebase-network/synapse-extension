export default {
  get CKB_RPC_ENDPOINT(): string {
    return process.env.CKB_RPC_ENDPOINT;
  },

  get CACHE_LAYER_ENDPOINT(): string {
    return process.env.CACHE_LAYER_ENDPOINT;
  },

  get CKB_RPC_ENDPOINT_MAINNET(): string {
    return process.env.CKB_RPC_ENDPOINT_MAINNET;
  },

  get CACHE_LAYER_ENDPOINT_MAINNET(): string {
    return process.env.CACHE_LAYER_ENDPOINT_MAINNET;
  },

  get isProduction(): boolean {
    return process.env.MODE !== 'DEV';
  },
};
