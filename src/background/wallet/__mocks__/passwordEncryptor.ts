export async function encrypt(privKey: Buffer, password: string) {
  const result = 'encrypt';
  return result;
}

export async function decrypt(input: string, password: string) {
  try {
    const result = 'decrypt';
    return result;
  } catch (error) {
    return null;
  }
}
