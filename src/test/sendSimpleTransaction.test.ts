
const CKB = require('@nervosnetwork/ckb-sdk-core').default
const nodeUrl = 'http://106.13.40.34:8114/'
const ckb = new CKB(nodeUrl)
                      

const privateKey = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const toAddress  = "ckt1qyqw975zuu9svtyxgjuq44lv7mspte0n2tmqa703cd";

const sendCapacity = BigInt(100000000000);
const sendFee = BigInt(1000000);

describe('transaction test', () => {
  it('send simple transaction', async () => {

    jest.setTimeout(100000)

    const secp256k1Dep = await ckb.loadSecp256k1Dep() // load the dependencies of secp256k1 algorithm which is used to verify the signature in transaction's witnesses.

    const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
    /**
     * to see the public key
     */
    //0304d793194278a005407cd53e6fbd290d8e2a8e90154b4123dc5e0e06a8a19ecb
    console.log(`Public key: ${publicKey}`)
    // console.log src/test/sendSimpleTransaction.test.ts:25
    // Public key: 0x03ec80924627d484afd9da7e701dbc7acbf612f573eb1098a1e0c813dbbdcc543c
    // console.log src/test/sendSimpleTransaction.test.ts:42
    // fromAddress => ckt1qyqwcnwg78e58tnsd4wqyq74yuxvls3076rqcmangd
  
    const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`
    /**
     * to see the public key hash
     */
    // console.log(`Public key hash: ${publicKeyHash}`)
  
    const addresses = {
      testnetAddress: ckb.utils.pubkeyToAddress(publicKey, {
        prefix: 'ckt'
      })
    }
    //ckt1qyqrpkej44pkt0anq8g0qv8wzlyusjx082xs2c2ux4
    console.log("fromAddress =>", addresses.testnetAddress);

    /**
     * to see the addresses
     */
    // console.log(JSON.stringify(addresses, null, 2))
  
    /**
     * calculate the lockHash by the address publicKeyHash
     * 1. the publicKeyHash of the address is required in the args field of lock script
     * 2. compose the lock script with the code hash(as a miner, we use blockAssemblerCodeHash here), and args
     * 3. calculate the hash of lock script via ckb.utils.scriptToHash method
     */
    // const lockScript = {
    //   hashType: "type",
    //   codeHash: blockAssemblerCodeHash,
    //   args: publicKeyHash,
    // }
    /**
     * to see the lock script
     */
    // console.log(JSON.stringify(lockScript, null, 2))
  
    // const lockHash = ckb.utils.scriptToHash(lockScript)
    const lockHash = ckb.generateLockHash(publicKeyHash, secp256k1Dep)

    /**
     * to see the lock hash
     */
    // console.log(lockHash)
  
    // method to fetch all unspent cells by lock hash
    const unspentCells = await ckb.loadCells({
      lockHash
    })
  
    /**
     * to see the unspent cells
     */
    console.log("unspentCells => ",unspentCells)
  
    /**
     * send transaction
     */
    // const toAddress = ckb.utils.privateKeyToAddress(privateKey, {
    //   prefix: 'ckt'
    // })

    const rawTransaction = ckb.generateRawTransaction({
      fromAddress: addresses.testnetAddress,
      toAddress: toAddress,
      capacity: sendCapacity,
      fee: sendFee,
      safeMode: true,
      cells: unspentCells,
      deps: ckb.config.secp256k1Dep,
    })
  
    rawTransaction.witnesses = rawTransaction.inputs.map(() => '0x')
    rawTransaction.witnesses[0] = {
      lock: '',
      inputType: '',
      outputType: ''
    }
  
    const signedTx = ckb.signTransaction(privateKey)(rawTransaction)
    /**
     * to see the signed transaction
     */
    console.log("signedTx =>", JSON.stringify(signedTx, null, 2))
  
    const realTxHash = await ckb.rpc.sendTransaction(signedTx)
    /**
     * to see the real transaction hash
     */
    console.log(`The real transaction hash is: ${realTxHash}`)

  });

});
