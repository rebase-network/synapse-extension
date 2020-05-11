import {Ckb} from "../utils/constants";
// const AnyPayLockScript = require("../keyper/locks/anypay");

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const ckb = new CKB(Ckb.remoteRpcUrl)

export const getCapacityByLockHash = async (lock) => {
//   let lockHash = "";
//   const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`
//   if (type == "Secp256k1") {
//     lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)
//   } else if (type == "Keccak256") {
//     lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep)//TODO Bug;
//   } else if (type == "AnyPay") {
//     const anypay = new AnyPayLockScript();
//     const deps = anypay.deps();
//     const anypayDep = {
//       hashType: anypay.hashType,
//       codeHash: anypay.codeHash,
//       outPoint: deps[0].outPoint
//     }
//     lockHash = ckb.generateLockHash(publicKeyHash, anypayDep);
//   }
//   console.log("--- CKB ---",JSON.stringify(ckb));

  const capacity = await ckb.rpc.getCapacityByLockHash(lock);
  console.log("--- capacity ---",JSON.stringify(capacity));
  return capacity;
}
