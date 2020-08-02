# Data structure in browser storage

## wallets data structure

```js
const walletCommon = {
  publicKey: 'addressObj.path',
  entropyKeystore: 'entropyKeystore',
  rootKeystore: 'rootKeystore',
  keystore: '_obj',
  keystoreType: 'KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE',
};

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
    },
  ],
};

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
      },
    ],
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
      },
    ],
  },
];
```

## currWallet data structure

```js
{
    "currWallet":{
      "index":1,
      "path":"", // 可为空
      "mainnetAddr":"ckb....",
      "testnetAddr":"ckt.....",
      "lockHash":".....",
      "keystore":"",
      "keystoreType":1
    }
}
```

## keystore data structure

```js
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
