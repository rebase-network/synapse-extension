import { utf8ToBytes, bytesToHex, hexToBytes } from '@nervosnetwork/ckb-sdk-utils/lib';

export function textToHex(text) {
  let result = text.trim();
  if (result.startsWith('0x')) {
    return result;
  }
  const bytes = utf8ToBytes(result);
  result = bytesToHex(bytes);
  return result;
}

export function textToBytesLength(text) {
  const textHex = textToHex(text);
  const result = hexToBytes(textHex);
  return result.length;
}
