import { encrypt, decrypt } from "../wallet/pkeystore";
import { mnemonicToEntropy, entropyToMnemonic, } from "../wallet/mnemonic";

// describe("keystore", () => {
//   test("encrypt", () => {
//     const v3 = encrypt(Buffer.from("9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", "hex"), "123456");
//     expect(v3).not.toBeNull();
//   });

//   test("decrypt", () => {
//     const seed = decrypt({
//       version: 3,
//       id: '0ab18d9d-2b56-4d65-87ca-fe9a25f87635',
//       crypto: {
//         ciphertext: '1d7093f6e04aeaca4354499d3ca8eb80f8f922af1a5b86cbfcb3a2ed62394263',
//         cipherparams: { iv: '608059dce8520b4eabddde6ef433eb40' },
//         cipher: 'aes-128-ctr',
//         kdf: 'scrypt',
//         kdfparams: {
//           dklen: 32,
//           salt: '5f0438ee33e50bcfa70648734fb09ab84be9e5203454e78cde5195ace94136b2',
//           n: 262144,
//           r: 8,
//           p: 1
//         },
//         mac: '9e511c5ef9174d63fa150e0793321c7953dea4232066f701fdd4a2727a215780'
//       }
//     }, "123456");
//     expect(seed).toEqual("9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8");
//   });

//   test("01- private encrypt", () => {
//     const v3 = encrypt(Buffer.from("cf0e22f14b26fc17cd2c001e13d3e910268483a441bd9c26ccda61330cd82c56", "hex"), "123456");
//     console.log()
//     expect(v3).not.toBeNull();
//   });
// });

const expextPrivateKey = "cf0e22f14b26fc17cd2c001e13d3e910268483a441bd9c26ccda61330cd82c56";
const expectV3 = {
            version: 3,
            id: '4d4e06de-bcd3-4554-ad67-3a0bb98106d5',
            crypto: {
              ciphertext: '0f7978f068abc7dce6c69578dfdea9554bffa687a7697870be65ddc97b3cc34e',
              cipherparams: { iv: 'fe8fdcf3a7703fb3fca831d50f988d18' },
              cipher: 'aes-128-ctr',
              kdf: 'scrypt',
              kdfparams: {
                dklen: 32,
                salt: '0be98468a53730d5a07edf55391bb4daabbc49a7eb6243c59edfb441828e5fef',
                n: 262144,
                r: 8,
                p: 1
              },
              mac: '6c2226db9c13dd5729be4df76d511d44d84dd0e0b50f9451fb654fb2644367cb'
            }
          };
describe('privateKey <===> Keystore', () => {
  it('01- private encrypt keystore', () => {
    const v3 = encrypt(Buffer.from("cf0e22f14b26fc17cd2c001e13d3e910268483a441bd9c26ccda61330cd82c56", "hex"), "123456");
    console.log(v3)
    expect(v3).not.toBeNull();
  });

  it('02- Keystore decrypt private', () => {
    const privateKey = decrypt(expectV3,"123456");
    expect(privateKey).toEqual(expextPrivateKey);
  });

  const expectMnemonic = "child lawsuit patch wage cook assault jelly miss repair output bring tennis";
  const expectEntroy = "27efc6837b12fa1b1df46eb693ac70ef";
  it('03- mnemonicToEntropy,', () => {
    const entroy = mnemonicToEntropy(expectMnemonic);
    expect(entroy).toEqual(expectEntroy);
  });

  it('04- mnemonicToEntropy,', () => {
    const mnemonic = entropyToMnemonic(expectEntroy);
    expect(mnemonic).toEqual(expectMnemonic);
  });

  it('05- entropy encrypt keystore', () => {
    const v3 = encrypt(Buffer.from(expectEntroy, "hex"), "123456");
    console.log(v3)
    expect(v3).not.toBeNull();
  });

  it('06- Keystore decrypt entropy', () => {
    const v3 = encrypt(Buffer.from(expectEntroy, "hex"), "123456");
    const seed = decrypt(v3,"123456");
    expect(seed).toEqual(expectEntroy);
  });

})