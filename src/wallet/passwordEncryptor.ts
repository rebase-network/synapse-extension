import passworder from 'browser-passworder';

export async function encrypt(privKey: Buffer, password: string) {
  const result = await passworder.encrypt(password, privKey);
  return result;
}

export async function decrypt(input: string, password: string) {
  try {
    const result = await passworder.decrypt(password, input);
    return result;
  } catch (error) {
    return null;
  }
}
