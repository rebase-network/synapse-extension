import * as passworder from 'browser-passworder';

export async function encrypt(privKey: Buffer, password: string) {
  return await passworder.encrypt(password, privKey);
}

export async function decrypt(
  input: string,
  password: string,
) {
  return await passworder.decrypt(password, input);
}
