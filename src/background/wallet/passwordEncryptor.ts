import passworder from 'browser-passworder';

export async function encrypt(privKey: Buffer, password: string) {
  let result;
  try {
    result = await passworder.encrypt(password, privKey);
  } catch (error) {
    // do nothing
  }
  return result;
}

export async function decrypt(input: string, password: string) {
  let result;
  try {
    result = await passworder.decrypt(password, input);
  } catch (error) {
    // do nothing
  }
  return result;
}
