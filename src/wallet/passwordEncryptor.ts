import passworder from 'browser-passworder';

export async function encrypt(privKey: Buffer, password: string) {
  return await passworder.encrypt(password, privKey);
}

export async function decrypt(input: string, password: string) {
  return await passworder.decrypt(password, input);
}

export async function checkByPassword(input: string, password: string) {
  try {
    return await passworder.decrypt(password, input);
  } catch (error) {
    console.log('error', error);
    return null;
  }
}
