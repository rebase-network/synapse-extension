
const keyperwalletTest = require('../keyper/keyperwallet');

describe('keyper ks test', () => {
    
    const privateKey = "448ff179b923f0602a00f68f23cb8425d30198446a1b5aa2a016deea2762b1f8";
    const password = "123456";

    it('keyper ks', async() => {

        jest.setTimeout(150000)

        await keyperwalletTest.init();
        const ks = await keyperwalletTest.generateByPrivateKey(privateKey, password);
        console.log("=== ks ==",ks);
        
    })
  })