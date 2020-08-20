/**
 * Base64 encodes an array buffer
 * @param {ArrayBuffer} arrayBuffer
 */
export function base64encode(arrayBuffer) {
  if (!arrayBuffer || arrayBuffer.length === 0) return undefined;

  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}

/**
 * Converts an array buffer to a UTF-8 string
 * @param {ArrayBuffer} arrayBuffer
 * @returns {string}
 */
export function arrayBufferToString(arrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

/**
 * Converts a string to an ArrayBuffer
 * @param {string} string string to convert
 * @returns {ArrayBuffer}
 */
export function stringToArrayBuffer(str) {
  return Uint8Array.from(str, (c) => c.toString().charCodeAt(0)).buffer;
}
/**
 * Logs a variable to console
 * @param {string} name variable name
 * @param {string} text variable content
 */
export function logVariable(name, text) {
  console.log(`${name}: ${text}`);
}
