import generateAddress from './generateAddress'

describe('generateAddress', () => {
  it('should output 1 with input 0', () => {
    expect(generateAddress(0)).toEqual(1)
  });

  // it('should output ckt12345 with input mnemonic ', () => {
  //   const mnemonic = '12 words'
  //   const address = 'ckt12345'
  //   expect(generateAddress(mnemonic)).toEqual(address)
  // });

});
