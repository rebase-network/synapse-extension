import { utf8ToBytes, bytesToHex } from '@nervosnetwork/ckb-sdk-utils/lib';

function textToHex(text) {
  let result = text.trim();
  if (result.startsWith('0x')) {
    return result;
  }
  const bytes = utf8ToBytes(result);
  result = bytesToHex(bytes);
  return result;
}

export default textToHex;
