import { privateKeyToPublicKey } from '@nervosnetwork/ckb-sdk-utils';
import { publicKeyToAddress } from '@src/wallet/address';
import { addKeyperWallet } from '@src/keyper/keyperwallet';
import { logVariable } from './utils';

async function generateAddressByAuthn(authData) {
  let generatePKObj = authData;
  generatePKObj = generatePKObj.substr(0, 64);
  const authnPrivateKey = `0x${generatePKObj}`;
  const publicKey = privateKeyToPublicKey(authnPrivateKey.toString());
  const address = publicKeyToAddress(publicKey);
  await addKeyperWallet(generatePKObj, '123456', '', '');
  return address;
}

export default generateAddressByAuthn;
