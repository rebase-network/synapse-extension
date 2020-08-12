export const fromAddress = 'ckt1qyqxq62839823nh2x82zhnrt5ktj88n5pmxs63njjf';
export const fromLockType = 'Secp256k1';
export const lockHash = '0x02b11786f5f5ee9fd12bd7b67d7967b1d83c5602df0d22a7bb535eec90856f24';
export const typeHash = '0xa8b69151db2de6031203da9189c955ddb9c311fa7557f3f6e583d149b6681301';
export const toAddress =
  'ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykykcrfg7y5a2xwagcag27vdwjewgu7ws8v6k44ckt';
export const sendSudtAmount = 150000;
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
        txHash: '0x4c119d8295a6cf81f40e0a7850a61103f6382186cd249662eb7a36afa7215c8e',
        index: '0x0',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0xd165f93fb21f70818b13c1f9225e358881c190adb69ff7788a9774e05546d3d8',
        index: '0x0',
      },
      since: '0x0',
    },
    {
      previousOutput: {
        txHash: '0xc0d01b55484b833ece95b309682b07329d0259617b3eeec42ea119d8f827e4c3',
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
        args: '0x606947894ea8ceea31d42bcc6ba597239e740ecd',
      },
      type: {
        hashType: 'data',
        codeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
        args: '0x8d24922aa4a5df0a9aa6cf855ea917c1cbb9efe5a66f2f744f0ec4543964974a',
      },
    },
    {
      capacity: '0x77b8b52ef0',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x606947894ea8ceea31d42bcc6ba597239e740ecd',
      },
    },
  ],
  witnesses: [
    {
      lock: '',
      inputType: '',
      outputType: '',
    },
    '0x',
    '0x',
  ],
  outputsData: ['0xf0490200000000000000000000000000', '0x'],
};
