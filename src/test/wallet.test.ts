
import { generateMnemonic, AccountExtendedPublicKey, ExtendedPrivateKey } from "../wallet/key";
import Keystore from '../wallet/keystore'
import Keychain from '../wallet/keychain';
import { entropyToMnemonic, mnemonicToSeedSync } from '../wallet/mnemonic';

import Address, { AddressType, AddressPrefix } from '../wallet/address'

import * as chrome from "sinon-chrome";
// import * as browser from 'sinon-chrome/webextensions'

// import extensions from 'sinon-chrome/extensions'
import browser from 'sinon-chrome/webextensions'

import { InvalidMnemonic, } from '../exceptions'

const keystore_file = {
  "crypto": {
    "cipher": "aes-128-ctr",
    "ciphertext": "253397209cae86474e368720f9baa30f448767047d2cc5a7672ef121861974ed",
    "cipherparams": {
      "iv": "8bd8523e0048db3a4ae2534aec6d303a"
    },
    "kdf": "scrypt",
    "kdfparams": {
      "dklen": 32,
      "n": 4096,
      "p": 6,
      "r": 8,
      "salt": "be3d86c99f4895f99d1a0048afb61a34153fa83d5edd033fc914de2c502f57e7"
    },
    "mac": "4453cf5d4f6ec43d0664c3895c4ab9b1c9bcd2d02c7abb190c84375a42739099"
  },
  "id": "id",
  "version": 3
}

const fixture = {
  "entropy": "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
  "mnemonic": "legal winner thank year wave sausage worth useful legal winner thank yellow",
  "seed": "878386efb78845b3355bd15ea4d39ef97d179cb712b77d5c12b6be415fffeffe5f377ba02bf3f8544ab800b955e51fbff09828f682052a20faa6addbbddfb096"
}

const fixture02 = {
  privateKey: 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
  publicKey: '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2',
  chainCode: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
}

const longSeed = Buffer.from(
  'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542',
  'hex'
)
const mnenonics = "excuse speak boring lunar consider sea behave next fog arrow black sweet"

const password = 'hello~!23'
const keystore = Keystore.create(new ExtendedPrivateKey(fixture02.privateKey, fixture02.chainCode), password)

describe('wallet', () => {

  it("should mnemonic length is 12", () => {
    const words = generateMnemonic();

    expect(words.split(" ").length).toEqual(12);

  })

  it("should check seed", () => {
    const seed = mnemonicToSeedSync(fixture.mnemonic)
    expect(seed.toString('hex')).toEqual(fixture.seed)
  })

  it('create master keychain from long seed', () => {
    const master = Keychain.fromSeed(longSeed)
    expect(master.privateKey.toString('hex')).toEqual(
      '4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e'
    )
    expect(master.identifier.toString('hex')).toEqual('bd16bee53961a47d6ad888e29545434a89bdfe95')
    expect(master.fingerprint).toEqual(3172384485)
    expect(master.chainCode.toString('hex')).toEqual('60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689')
    expect(master.index).toEqual(0)
    expect(master.depth).toEqual(0)
    expect(master.parentFingerprint).toEqual(0)
  })


  describe('load and check password', () => {

    it('checks wrong password', () => {
      expect(keystore.checkPassword(`oops${password}`)).toBe(false)
    })

    it('checks correct password', () => {
      expect(keystore.checkPassword(password)).toBe(true)
    })

    it('decrypts', () => {
      expect(keystore.decrypt(password)).toEqual(
        new ExtendedPrivateKey(fixture02.privateKey, fixture02.chainCode).serialize()
      )
    })

    it('loads private key', () => {
      const extendedPrivateKey = keystore.extendedPrivateKey(password)
      expect(extendedPrivateKey.privateKey).toEqual(fixture02.privateKey)
      expect(extendedPrivateKey.chainCode).toEqual(fixture02.chainCode)
    })


  })


  describe("save keystore to chrome plugin", () => {

    afterAll(() => {
      chrome.flush()
      browser.flush()
    })

    it("should save 1 file to chrome plugin", () => {
      // https://github.com/acvetkov/sinon-chrome/issues/82#issuecomment-467036622

      const password = "hello~!23"
      const keystore = Keystore.create(new ExtendedPrivateKey(fixture02.privateKey, fixture02.chainCode), password)

      // console.log("keystore =>", keystore)
      // keystore.tojson

      chrome.storage.sync.set({
        key: keystore
      }, () => {
        console.log('Value is set to ' + keystore);
      });

      chrome.storage.sync.get(['key'], (result) => {
        expect(result.key).toEqual(keystore)
      })
    })

  })


  describe("ckb address", () => {

      it("from private key get ckb address", () => {
          const seed = mnemonicToSeedSync(mnenonics)
          const masterKeychain = Keychain.fromSeed(seed)

          const extendedKey = new ExtendedPrivateKey(
              masterKeychain.privateKey.toString('hex'),
              masterKeychain.chainCode.toString('hex')
          )

          const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

          const accountExtendedPublicKey = new AccountExtendedPublicKey(
              accountKeychain.publicKey.toString('hex'),
              accountKeychain.chainCode.toString('hex')
          )

          const address = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);

          expect(address.address).toEqual("ckb1qyqt9ed4emcxyfed77ed0dp7kcm3mxsn97lsvzve7j")

      })

  })

});