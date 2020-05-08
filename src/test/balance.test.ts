import { privateKeyToPublicKey, pubkeyToAddress } from '@nervosnetwork/ckb-sdk-utils';
import Address, { AddressType, publicKeyToAddress, AddressPrefix } from '../wallet/address';
import loadCells from '../wallet/balance/loadCells';
import { getBalanceByPublicKey } from '../balance';
import { mnemonicToSeedSync } from '../wallet/mnemonic';
import Keystore from '../wallet/keystore';
import Keychain from '../wallet/keychain';
import { AccountExtendedPublicKey, ExtendedPrivateKey } from '../wallet/key';
import { CKBToShannonFormatter, shannonToCKBFormatter } from '../wallet/formatters';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const nodeUrl = 'http://localhost:8114';
const ckb = new CKB(nodeUrl);
// console.log("ckb => ",JSON.stringify(ckb))

const mnemonic = 'excuse speak boring lunar consider sea behave next fog arrow black sudden';
const password = '123456';
const expectSeed =
  '{"type":"Buffer","data":[159,221,231,129,5,180,163,242,168,152,210,1,43,56,48,85,171,126,12,41,144,74,65,55,235,124,247,77,108,45,67,83,45,5,122,139,175,196,33,171,88,85,58,36,67,65,203,242,112,133,221,85,143,130,254,96,248,217,196,108,1,36,109,171]}';
const expectMasterKeychain =
  '{"privateKey":{"type":"Buffer","data":[199,136,252,116,86,25,199,64,62,107,4,59,106,18,6,136,180,216,10,96,91,155,28,37,110,241,163,123,115,71,140,249]},"publicKey":{"type":"Buffer","data":[3,213,244,72,237,170,217,90,202,90,244,112,169,123,72,114,106,8,255,226,26,160,218,112,177,17,10,144,5,120,100,221,144]},"chainCode":{"type":"Buffer","data":[68,149,98,215,97,33,247,211,236,112,154,243,140,198,37,210,5,140,213,85,101,246,169,196,1,200,52,150,77,248,156,25]},"index":0,"depth":0,"identifier":{"type":"Buffer","data":[98,42,17,174,27,228,112,244,239,226,182,228,198,35,199,232,87,179,148,55]},"fingerprint":1646924206,"parentFingerprint":0}';
const expectExtendedKey =
  '{"privateKey":"c788fc745619c7403e6b043b6a120688b4d80a605b9b1c256ef1a37b73478cf9","chainCode":"449562d76121f7d3ec709af38cc625d2058cd55565f6a9c401c834964df89c19"}';
// expectKeystore每次生成都会变化
const expectKeystore =
  '{"version":3,"crypto":{"ciphertext":"6ce0024645d3f6accdae141e9911826b3743bcab32691a611f84040ba86e010d5acb82f7d0307dee87d51c00d08b0c2ff540d5836d34d6d4861af17fd3748e11","cipherparams":{"iv":"7d0dfd85ae8834e3d693a42798747a54"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"9b4d20b6bad3f29cd6095eb586523879188c97f11d41006d2daa659c6dced340","n":262144,"r":8,"p":1},"mac":"398ca21b017c68bdd118c133f4e85bf3819845af1f6849354b330c08616c3a57"},"id":"ac42c0fc-fc31-4367-b510-dda64948989b"}';
const expectTestAddress = 'ckt1qyqpershwv97zr6qrwshre8z3yn08ytr2tlq0ua0yl';
const expectTestPublicKey = '0x020f1df8263cad244cbd48cb9adcfb87429ab42319be7c6c7cea5b442ca281b232';
const expectTestPrivateKey = '0x1f78d67849d9503c6f21e1432383501dabac78e7f7eb5c51a5f7f2470bd97c42';

describe('balance test privateKey,publicKey,address,keystore', () => {
  it('get seed by memonic', async () => {
    const seed = mnemonicToSeedSync(mnemonic);
    expect(JSON.stringify(seed)).toBe(expectSeed);
  });

  it('get masterKeychain by memonic', async () => {
    const seed = mnemonicToSeedSync(mnemonic);
    expect(JSON.stringify(seed)).toBe(expectSeed);
    const masterKeychain = Keychain.fromSeed(seed);
    expect(JSON.stringify(masterKeychain)).toBe(expectMasterKeychain);
  });

  it('get extendedKey by memonic', async () => {
    const seed = mnemonicToSeedSync(mnemonic);
    expect(JSON.stringify(seed)).toBe(expectSeed);
    const masterKeychain = Keychain.fromSeed(seed);
    expect(JSON.stringify(masterKeychain)).toBe(expectMasterKeychain);
    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    expect(JSON.stringify(extendedKey)).toBe(expectExtendedKey);
  });

  //   it('get keystore by memonic',async () => {
  //     const seed = mnemonicToSeedSync(mnemonic)
  //     const masterKeychain = Keychain.fromSeed(seed)
  //     const extendedKey = new ExtendedPrivateKey(
  //       masterKeychain.privateKey.toString('hex'),
  //       masterKeychain.chainCode.toString('hex')
  //     )
  //     const keystore = Keystore.create(extendedKey, password);
  //     expect(JSON.stringify(keystore)).toBe(JSON.stringify(expectKeystore));
  //   })

  it('get publicKey address by masterKeychain', async () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex'),
    );
    const keystore = Keystore.create(extendedKey, password);
    const accountKeychain = masterKeychain.derivePath(`m/44'/309'/0'`);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
      accountKeychain.publicKey.toString('hex'),
      accountKeychain.chainCode.toString('hex'),
    );

    // 判断 AddressPrefix Mainnet=>Testnet
    const addrTestnet = accountExtendedPublicKey.address(
      AddressType.Receiving,
      0,
      AddressPrefix.Testnet,
    );
    const addrMainnet = accountExtendedPublicKey.address(
      AddressType.Receiving,
      0,
      AddressPrefix.Mainnet,
    );
    // console.log('addrTestnet: ' + JSON.stringify(addrTestnet));
    // console.log('addrMainnet: ' + JSON.stringify(addrMainnet));
    expect(addrTestnet.address).toBe(expectTestAddress);
    expect(`0x${  addrTestnet.publicKey}`).toBe(expectTestPublicKey);
  });

  it('get privateKey publicKey address by mnemonic', async () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const masterKeychain = Keychain.fromSeed(seed);

    const privateKey =
      `0x${ 
      masterKeychain.derivePath(`m/44'/309'/0'/0`).deriveChild(0, false).privateKey.toString('hex')}`;
    const publicKey = privateKeyToPublicKey(privateKey);
    const address = pubkeyToAddress(publicKey);

    expect(privateKey).toBe(expectTestPrivateKey);
    expect(publicKey).toBe(expectTestPublicKey);
    expect(address).toBe(expectTestAddress);
  });

  it('get privateKey publicKey address by keystore', async () => {
    const keystore = Keystore.fromJson(expectKeystore); // 参数是String
    const masterPrivateKey = keystore.extendedPrivateKey(password);
    const masterKeychain = new Keychain(
      Buffer.from(masterPrivateKey.privateKey, 'hex'),
      Buffer.from(masterPrivateKey.chainCode, 'hex'),
    );
    const privateKey =
      `0x${ 
      masterKeychain.derivePath(`m/44'/309'/0'/0`).deriveChild(0, false).privateKey.toString('hex')}`;
    const publicKey = privateKeyToPublicKey(privateKey);
    const address = pubkeyToAddress(publicKey);

    expect(privateKey).toBe(expectTestPrivateKey);
    expect(publicKey).toBe(expectTestPublicKey);
    expect(address).toBe(expectTestAddress);
  });

  it('get balance by publicKey', async () => {
    jest.setTimeout(100000);

    const capacityAll = await getBalanceByPublicKey(expectTestPublicKey);
    // 50000000000000000000n
    console.log(BigInt(CKBToShannonFormatter(capacityAll.toString())));
    // 5,000
    console.log(shannonToCKBFormatter(capacityAll.toString()).toString());
    expect(BigInt(capacityAll)).toBe(BigInt(500000000000));
  });

  // it('get balance by address',async () => {
  //   const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
  //   console.log("publicKey =>", publicKey); //0x037a3192467ef7046070b49eaa2f4706fee19a69bcdd7f6d3b8ab4f7407365089e
  //   const address = publicKeyToAddress(publicKey, AddressPrefix.Testnet);
  //   console.log("address =>", address); //ckt1qyqwmdw88u4y4kxlydr8e8e5gm6c2x67x0dqqxpt4l

  //   const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  //   await ckb.loadSecp256k1Dep();
  //   // console.log(ckb.config.secp256k1Dep);
  //   const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)
  //   expect(lockHash).toBe('0x518873a48f98d19cd1529db846a6d4d89ce92577660e72080b74e3dccd45dfb0')

  //   const tipBlockNumber = await ckb.rpc.getTipBlockNumber();
  //   console.log(tipBlockNumber)
  //   // const cells = await ckb.rpc.getCellsByLockHash(lockHash, '0x687f', tipBlockNumber)
  //   // console.log(JSON.stringify(cells));
  //   // let capacityAll = BigInt(0);
  //   // for (let cell of cells) {
  //   //   // console.log(JSON.stringify(cell));
  //   //   // console.log(BigInt(cell.capacity));
  //   //   capacityAll = capacityAll + BigInt(cell.capacity);
  //   // }
  //   // console.log(BigInt(capacityAll));
  //   // expect(BigInt(capacityAll)).toBe(BigInt(500000000000));
  //   const cells = await loadCells({
  //     lockHash: lockHash,
  //     start: '0x1',
  //     end: tipBlockNumber,
  //     STEP: '0x64',
  //     rpc: ckb.rpc,
  //   });
  //   let capacityAll = BigInt(0);
  //   for (let cell of cells) {
  //     // console.log(JSON.stringify(cell));
  //     // console.log(BigInt(cell.capacity));
  //     capacityAll = capacityAll + BigInt(cell.capacity);
  //   }
  //   console.log(BigInt(capacityAll));

  //   // console.log(`0x${currentFrom.toString(16)}`);
  //   // console.log(`0x${currentTo.toString(16)}`);

  // })
});

// console.log src/test/balance.test.ts:35
// 0x688a

// console.log src/test/balance.test.ts:37
// [
//   {
//     blockHash: '0xada9ff6e1b1839d8756ec2270af92e2beb36bd859fb051c1f67daa86d2603f81',
//     lock: {
//       codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
//       hashType: 'type',
//       args: '0xedb5c73f2a4ad8df23467c9f3446f5851b5e33da'
//     },
//     outPoint: {
//       txHash: '0xfdf2de9201544017c66f68e841cce9831930fd5251bdb6fdcffb641c30ed6123',
//       index: '0x0'
//     },
//     outputDataLen: '0x0',
//     capacity: '0x746a528800',
//     cellbase: false,
//     type: null
//   }
// ]

// public generateLockHash = (
//   publicKeyHash: PublicKeyHash,
//   deps: Omit<DepCellInfo, 'outPoint'> | undefined = this.config.secp256k1Dep,
// ) => {
//   if (!deps) {
//     throw new ArgumentRequired('deps')
//   }

//   return this.utils.scriptToHash({
//     hashType: deps.hashType,
//     codeHash: deps.codeHash,
//     args: publicKeyHash,
//   })
// }

// public loadSecp256k1Dep = () => {
//   const genesisBlock = await this.rpc.getBlockByNumber('0x0')

//   /* eslint-disable prettier/prettier, no-undef */
//   const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
//   const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type
//   /* eslint-enable prettier/prettier, no-undef */

//   if (!secp256k1DepTxHash) {
//     throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
//   }

//   if (!typeScript) {
//     throw new Error('Secp256k1 type script not found')
//   }

//   const secp256k1TypeHash = this.utils.scriptToHash(typeScript)

//   this.config.secp256k1Dep = {
//     hashType: 'type',
//     codeHash: secp256k1TypeHash,
//     outPoint: {
//       txHash: secp256k1DepTxHash,
//       index: '0x0',
//     },
//   }
//   return this.config.secp256k1Dep
// }
