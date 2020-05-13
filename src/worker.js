// import * as Keystore from './wallet/keystore';

export default () => {
  // Receive message from main file
  self.onmessage = function (e) {
    console.log(e.data);
    console.time('--->>> web work root private key');
    const {
      extendedKey,
      password
    } = e.data;
    // const rootKeystore = Keystore.encrypt(Buffer.from(extendedKey.serialize(), 'hex'), password);
    const rootKeystore = 'aaaaaaaaaaaaaa';
    console.timeEnd('--->>> web work root private key');
    // Send message to main file
    self.postMessage(rootKeystore, '*');
  };
}