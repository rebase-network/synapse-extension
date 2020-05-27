describe('keyper test', () => {
  const keyperwalletTest = require('../keyper/keyperwallet');
  const privateKey = '448ff179b923f0602a00f68f23cb8425d30198446a1b5aa2a016deea2762b1f8';
  const password = '123456';

  it.skip('keyper ', async () => {
    // FIXME: jsdom does not implement crypto, can not test
    jest.setTimeout(150000);

    await keyperwalletTest.init();
    const ks = await keyperwalletTest.generateByPrivateKey(privateKey, password);
    console.log('=== ks ==', ks);
  });
});
