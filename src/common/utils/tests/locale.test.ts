import { getDefaultLanguage } from '../locale';

describe('locale', () => {
  it('getDefaultLanguage', () => {
    const result = getDefaultLanguage();
    expect(result).toEqual('en');
  });
  it('getDefaultLanguage return en', () => {
    localStorage.setItem('language', 'abc');
    const result = getDefaultLanguage();
    expect(result).toEqual('en');
  });
});
