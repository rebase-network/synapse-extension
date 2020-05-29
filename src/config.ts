
class ConfigService {
  private getValue(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public get(key: string): string {
    return this.getValue(key, true);
  }

  get CKB_RPC_ENDPOINT(): string {
    return process.env.CKB_RPC_ENDPOINT;
  }

  get CKB_INDEXER_ENDPOINT(): string {
    return process.env.CKB_INDEXER_ENDPOINT;
  }

  get CACHE_LAYER_ENDPOINT(): string {
    return process.env.CACHE_LAYER_ENDPOINT;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }
}

const configService = new ConfigService()
  .ensureValues([
    'CKB_RPC_ENDPOINT',
    'CKB_INDEXER_ENDPOINT',
    'CACHE_LAYER_ENDPOINT',
  ])

export { configService };
