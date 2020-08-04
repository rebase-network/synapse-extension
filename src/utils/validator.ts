import * as Yup from 'yup';
import * as bech32 from "bech32";

// password: Yup.string().trim().min(6).required('Required'),
// confirmPassword: Yup.string()
//   .trim()
//   .oneOf([Yup.ref('password')], "Passwords don't match!")
//   .required('Required'),

export function ckbAddressValidator(address: string): boolean {
  if (address.length !== 46 && address.length !== 95) {
    return false
  }

  const payload = bech32.decode(address, 95);
  if (payload.prefix !== 'ckb' && payload.prefix !== 'ckt') {
    return false
  }

  const data = bech32.fromWords(payload.words);
  if (data[0] === 1) {
    // short address
    if (data[1] === 0 || data[1] === 1) {
      // SECP256K1 + blake160
      return true
    } else {
      return false
    }
  }
  else if (data[0] === 2 || data[0] === 4) {
    // long hash_type: data
    return true
  } else {
    return false
  }
}

export function passwordValidator() {
  return Yup.string().trim().min(6).max(20).required('Required')
}

export function shortAddressValidator() {
  return Yup.string().trim().length(46).matches(/^(ckb|ckt)/);
}

export function longAddressValidator() {
  // ckt1qjr2r35c0f9vhcdgslx2fjwa9tylevr5qka7mfgmscd33wlhfykykf6dcm8qc7r8z0x2k7gyn329rmxdeksy56x4crx
  return Yup.string().trim().length(95).matches(/^(ckb|ckt)/);
}




// yup.object().shape({
//   name: string().required(),
//   age: number().required().positive().integer(),
//   email: string().email(),
//   website: string().url(),
// });