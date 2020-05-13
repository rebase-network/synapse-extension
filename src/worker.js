// import * as Keystore from './wallet/keystore';
importScripts('./keystore.js');


console.log('enter worker ===>');

export default () => {
  // Receive message from main file
  self.onmessage = function (e) {
    console.log(e.data);
    console.time('--->>> web work root private key');
    const {
      extendedKeyBuffer,
      password
    } = e.data;
    const rootKeystore = Keystore.encrypt(extendedKeyBuffer, password);
    // const rootKeystore = 'aaaaaaaaaaaaaa';
    console.timeEnd('--->>> web work root private key');
    // Send message to main file
    self.postMessage(rootKeystore);
  };
}


// export default () => {
//   self.onmessage = function (e) {
//     console.log(e.data);
//     const {
//       a,
//       b
//     } = e.data;
  
//     self.postMessage(a*b );
//   };
// }
