### wallets数据结构

```json
{
    "wallets":[
        {
            "path":"", // 可为空，通过privatekey生成的地址没有
            "blake160":"xx",
            "mainnetAddr":"ckb....",
            "testnetAddr":"ckt.....",
            "lockHash":".....",
            "rootKeystore":"", // 可为空，通过privatekey生成的地址没有rootKeystore
            "keystore":"",
            "keystoreType":1 // 1-通过助记词生成的， 2-通过keystore生成的，// 3-通过privatekey生成的，只能导出私钥
        },
        {
            ......
        }
    ]
}

```

### currWallet数据结构

```json
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

### keystore 数据结构

```json
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