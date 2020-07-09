class ConfigService {
  env: any;

  constructor() {
    this.env = process.env;
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public get(key: string): string {
    return this.getValue(key, true);
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode !== 'DEV';
  }
}

const configService = new ConfigService().ensureValues([
  'CKB_RPC_ENDPOINT',
  'CACHE_LAYER_ENDPOINT',
]);

export default configService;
