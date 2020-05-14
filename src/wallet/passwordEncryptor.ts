import * as passworder from 'browser-passworder';

export async function encrypt(privKey: Buffer, password: string){

  console.log(typeof passworder.encrypt(password, privKey));
  
  return await passworder.encrypt(password, privKey);
}

export async function decrypt(
  input: string ,
  password: string,
) {

  console.log(typeof passworder.decrypt(password, input));
  return await passworder.decrypt(password, input);
}
