## How dapp sends tx with Synapse

Your can call window.ckb.send function from web page:
```js
window.ckb.send(params);
```

params has the following structure：
```js
{
  from?: string;
  to: string;
  capacity: number;
  fee?: number;
}
```

Example:
```js
window.ckb.send({
  from: 'ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn',
  to: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
  capacity: 1000,
  fee: 0.001
})
```

## wallets data structure

```javascript
const walletCommon = {
  publicKey: 'addressObj.path',
  blake160: 'blake160',
  entropyKeystore: 'entropyKeystore',
  rootKeystore: 'rootKeystore',
  keystore: '_obj',
  keystoreType: 'KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE',
}

const addressesObj = {
  publicKey: 'publicKey',
  addresses: [
    {
      lockScriptType: 'lockScriptType',
      address: 'address',
      lockHash: 'lockHash',
    },
    {
      lockScriptType: 'lockScriptType',
      address: 'address',
      lockHash: 'lockHash',
    },
    {
      lockScriptType: 'lockScriptType',
      address: 'address',
      lockHash: 'lockHash',
    }
  ]
}

const addressesList = [
  {
    publicKey: 'publicKey_111',
    addresses: [
      {
        lockScriptType: 'secp256k1',
        address: 'address_secp256k1', // [{capacity, data, type, lock}]
        lockHash: 'lockHash_secp256k1',
      },
      {
        lockScriptType: 'keccak256',
        address: 'address_keccak256',
        lockHash: 'lockHash_keccak256',
      },
      {
        lockScriptType: 'anypay',
        address: 'address_anypay',
        lockHash: 'lockHash_anypay',
      }
    ]
  },
  {
    publicKey: 'publicKey_2222',
    addresses: [
      {
        lockScriptType: 'secp256k1',
        address: 'address_secp256k1',
        lockHash: 'lockHash_secp256k1',
      },
      {
        lockScriptType: 'keccak256',
        address: 'address_keccak256',
        lockHash: 'lockHash_keccak256',
      },
      {
        lockScriptType: 'anypay',
        address: 'address_anypay',
        lockHash: 'lockHash_anypay',
      }
    ]
  }
]
```

## currWallet data structure

```javascript
{
    "currWallet":{
      "index":1,
      "path":"", // 可为空
      "blake160":"xx",
      "mainnetAddr":"ckb....",
      "testnetAddr":"ckt.....",
      "lockHash":".....",
      "keystore":"",
      "keystoreType":1
    }
}
```

## keystore data structure

```javascript
    "keystore":{
        "crypto":{
            "cipher":"aes-128-ctr",
            "cipherparams":{
                "iv":"d88205823cf3d6f2d24ccf915ba7a251"
            },
            "ciphertext":"ea9a56512f8562c7f993ee823fc6711b09edcf2e37c3ec3ec703257ceeb6ad455aee34c212c43424d6ae59e911e1e8d77836b8477dd55e8971f31ee6e59c8821",
            "kdf":"scrypt",
            "kdfparams":{
                "dklen":32,
                "n":262144,
                "p":1,
                "r":8,
                "salt":"d6e55f2d782fba0c46218cebaffef6c18ea508b8187d7b0d822c7f95546981d3"
            },
            "mac":"dc071b2d2f47dcce4cf5bcf06ac00d3eebc5b9e5989a9687cd1762d1ca7a7037"
        },
        "id":"d83cd414-16a2-4beb-a989-2fff61250121",
        "version":3
    }
```
