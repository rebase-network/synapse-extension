import Address, { AddressType, publicKeyToAddress, AddressPrefix } from './wallet/address';
import { Ckb } from './utils/constants';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;

const ckb = new CKB(Ckb.remoteRpcUrl);

export const getPrivateKeyByMasterKeychainAndPath = (masterKeychain, path) => {
  return masterKeychain.derivePath(path).deriveChild(0, false).privateKey.toString('hex');
};

export const sendSimpleTransaction = async (
  privateKey,
  fromAddress,
  toAddress,
  sendCapacity,
  sendFee,
) => {
  // load the dependencies of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.
  const secp256k1Dep = await ckb.loadSecp256k1Dep();

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
  /**
   * to see the public key
   */
  // console.log(`Public key: ${publicKey}`)

  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;
  /**
   * to see the public key hash
   */
  // console.log(`Public key hash: ${publicKeyHash}`)

  /**
   * calculate the lockHash by the address publicKeyHash
   * 1. the publicKeyHash of the address is required in the args field of lock script
   * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
   * 3. calculate the hash of lock script via ckb.utils.scriptToHash method
   */
  const lockHash = ckb.generateLockHash(publicKeyHash, secp256k1Dep);
  console.log('translaction lockhash =>', lockHash);
  /**
   * to see the lock hash
   */
  // console.log(lockHash)

  // method to fetch all unspent cells by lock hash
  const unspentCells = await ckb.loadCells({
    //
    lockHash,
    start: BigInt(30000),
    // STEP: '0x64',
    // rpc: ckb.rpc,
  });

  console.log('unspentCells =>', unspentCells);

  // const toAddress = ckb.utils.privateKeyToAddress(privateKey, {
  //   prefix: 'ckt'
  // })

  const rawTransaction = ckb.generateRawTransaction({
    fromAddress,
    toAddress,
    capacity: sendCapacity,
    fee: sendFee,
    safeMode: true,
    cells: unspentCells,
    deps: ckb.config.secp256k1Dep,
  });

  rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x');
  rawTransaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: '',
  };

  const signedTx = ckb.signTransaction(privateKey)(rawTransaction);
  /**
   * to see the signed transaction
   */
  console.log('signedTx =>', JSON.stringify(signedTx, null, 2));

  const realTxHash = await ckb.rpc.sendTransaction(signedTx);
  /**
   * to see the real transaction hash
   */
  console.log(`The real transaction hash is: ${realTxHash}`);
  return realTxHash;
};

// add by river
// console.log(masterKeychain
//             .derivePath(`m/44'/309'/0'/0`)
//             .deriveChild(0,false)
//             .privateKey.toString('hex'))
// console.log(masterKeychain
//             .derivePath(`m/44'/309'/0'/0`)
//             .deriveChild(0,false)
//             .publicKey.toString('hex'))
