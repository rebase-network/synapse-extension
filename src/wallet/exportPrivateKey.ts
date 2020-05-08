import Keystore from '../wallet/keystore';
import Keychain from '../wallet/keychain';
import { ExtendedPrivateKey } from '../wallet/key';

export const getPrivateKeyByKeyStoreAndPassword = (keystoreString, password) => {
  const keystore = Keystore.fromJson(keystoreString); //参数是String
  const masterPrivateKey = keystore.extendedPrivateKey(password);
  const masterKeychain = new Keychain(
    Buffer.from(masterPrivateKey.privateKey, 'hex'),
    Buffer.from(masterPrivateKey.chainCode, 'hex'),
  );
  const privateKey =
    '0x' +
    masterKeychain.derivePath(`m/44'/309'/0'/0`).deriveChild(0, false).privateKey.toString('hex');
  return privateKey;
};
