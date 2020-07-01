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

export const hexToDecimal = (hexStr: string, isBigEndian = true) => {
  if (isBigEndian) {
    return parseInt(hexStr, 16);
  }
  return parseInt(`0x${hexStr.replace('0x', '').match(/../g).reverse().join('')}`, 16);
};
