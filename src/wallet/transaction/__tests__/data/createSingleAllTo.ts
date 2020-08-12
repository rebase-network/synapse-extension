export const fromAddress = 'ckt1qyqyful8xljcwnue3vvvuf0zeucc4yvuypmqlxdkmh';
export const fromLockType = 'Secp256k1';
export const lockHash = '0xc86d0baf6b7813807680dc93252d408aba37764cbdd01741d4a4dbef9683e580';
export const typeHash = '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301';
export const toAddress =
  'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykyk38nuum7tp60nx933n39ut8nrz53nss8vkw52vu';
export const sendSudtAmount = 10000;
export const fee = 10000;
export const password = '123456';

export const expectSignedTx = {
  version: '0x0',
  cellDeps: [
    {
      outPoint: {
        txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
        index: '0x0',
      },
      depType: 'depGroup',
    },
    {
      outPoint: {
        txHash: '0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c',
        index: '0x0',
      },
      depType: 'depGroup',
    },
    {
      outPoint: {
        txHash: '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958',
        index: '0x0',
      },
      depType: 'code',
    },
  ],
  headerDeps: [],
  inputs: [
    {
      previousOutput: {
        txHash: '0xe2c9448d843b4578e66419384d86b0902bcb2fd65abc330d7fa6d20be6defa3f',
        index: '0x0',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0x06c965bee34adf00d8248c4076376369d0a5cc196055f9d0f21a63a942f63ec7',
        index: '0x0',
      },
      since: '0x0',
    },
  ],
  outputs: [
    {
      capacity: '0x34e62ce00',
      lock: {
        hashType: 'type',
        codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
        args: '0x44f3e737e5874f998b18ce25e2cf318a919c2076',
      },
      type: {
        hashType: 'data',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
      },
    },
    {
      capacity: '0x746a5260f0',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x44f3e737e5874f998b18ce25e2cf318a919c2076',
      },
    },
  ],
  witnesses: [
    {
      inputType: '',
      lock: '',
      outputType: '',
    },
    '0x',
  ],
  outputsData: ['0x10270000000000000000000000000000', '0x'],
};
