const crypto = require('crypto');

import { generateMnemonic, AccountExtendedPublicKey, ExtendedPrivateKey } from "./key";
import Keystore from './keystore'
import Keychain from './keychain';
import { entropyToMnemonic, mnemonicToSeedSync } from './mnemonic';

import { InvalidMnemonic, } from '../exceptions'

import BN from 'bn.js'


describe('Popup', () => {

  it('generate mnenonic', () => {
    // const words = generateMnemonic();

    const entropySize = 16;

    const entropy = crypto.randomBytes(entropySize).toString('hex');

    console.log("entropy >>>", entropy);

    const seed = mnemonicToSeedSync(entropy)

    console.log("seed >>> " , seed.toString('hex'));

    const masterKeychain = Keychain.fromSeed(seed)
    if (!masterKeychain.privateKey) {
      throw new InvalidMnemonic()
    }

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )

    console.log("masterKeychain.privateKey " , masterKeychain.privateKey.toString("hex") );
    console.log("masterKeychain.chainCode " , masterKeychain.chainCode.toString("hex") );

    const password = "123456"

    const keystore = Keystore.create(extendedKey, password) // 生成文件

    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath)

    // console.log("AccountExtendedPublicKey.ckbAccountPath ", AccountExtendedPublicKey.ckbAccountPath);

    // const accountExtendedPublicKey = new AccountExtendedPublicKey(
    //   accountKeychain.publicKey.toString('hex'),
    //   accountKeychain.chainCode.toString('hex')
    // )

    // expect(wrapper.containsMatchingElement(<Title title={'Import Mnemonic'} />)).toEqual(true)
  })

});