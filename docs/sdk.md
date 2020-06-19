# Synapse sdk

DApp demo: https://github.com/rebase-network/simplestdapp/

Synapse will inject a object `ckb` into browser `window` object, so you can use method under ckb directly. The following docs will talk about how to use the methods provided by ckb.

**Note**: The sdk will be changed frequently before we publish the production version. If you have any questions, problems and suggestions, do not hesitate to create an issue.

## Get address info

### Method
```js
ckb.getAddressInfo

const addressInfo = ckb.getAddressInfo()
```
### Return value
```js
{
  address: string; // current address(secp256k1)
  lock: string; // lock script hash value
  publicKey: stirng;  // public key
  type: string, // currently a fixed value: Secp256k1
  capacity: string; // capacity in string format, such as "516899970000"
}
```
### Example
```js
const addressInfo = ckb.getAddressInfo()
console.log('addressInfo: ', addressInfo);
```
will output:
```js
addressInfo: {
  "address":"ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn",
  "lock":"0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b",
  "publicKey":"0x021b30b3047a645d8b6c10c513b767a3e08efa1a53df5f81bcb37af3c8c8358ae9",
  "type":"Secp256k1",
  "capacity":"516899970000"
}
```

## Send tx

Dapp could use `send` method to send tx with Synapse, it will bring up a notification window with the send tx form.

### Method:

```js
ckb.send

const tx = await send(params);
```

`params` has the following structure：

```js
// ? means optional
params: {
  tx?: TX_JSON, // not in use for now
  meta: { // this is required
    capacity: number;
    to: string;
    from?: string;
    fee?: number;
    data?: string;
  }
}
```

### Return value:
```js
{
  type: string; // the value is "sign_send"
  success: boolean;
  message: string;  // now is a fixed value: 'tx is sent'
  data: {
    hash: string; // tx hash, will be empty string if fail to send tx
    tx: {
      fromAddress: string;  // will be change to `from` in next version
      toAddress: string;  // will be change to `to` in next version
      amount: number; // the unit will be `CKB`, will be change to `capacity` in next version
      fee: number;  // currently the default value is 0.001
      hash: string; // same value with previous one
    },
  },
};
```
### Example:
```js
const rawTxWithMeta = {
  "meta": {
    "from": "ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn",
    "to": "ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae",
    "capacity": 100,
    "data": "0x68656c6c6f20636b62"  // hello ckb
  }
}

const txResult = await ckb.send(rawTxWithMeta);
```

**TX is sent successfully:**
```js
{
  type: "sign_send",
  success: true,
  message: 'tx is sent',
  data: {
    hash: '0x02805e5a97a09ab9e8634fb0d3c75ed2ee4669f7e2ef67dcc33dc6d7f931821d',
    tx: {
      fromAddress: ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn,  // will be change to `from` in next version
      toAddress: ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae,  // will be change to `to` in next version
      amount: 100,  // will be change to `capacity` in next version
      fee: 0.001,
      hash: '0x02805e5a97a09ab9e8634fb0d3c75ed2ee4669f7e2ef67dcc33dc6d7f931821d',
    },
  },
};
```

**TX fail to send:**
`success` value will be `false`, `hash` will be empty string.

```js
{
  type: "sign_send",
  success: false,
  message: 'tx is sent',
  data: {
    hash: '',
    tx: {
      fromAddress: ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn,  // will be change to `from` in next version
      toAddress: ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae,  // will be change to `to` in next version
      amount: 100,  // will be change to `capacity` in next version
      fee: 0.001,
      hash: '',
    },
  },
};
```


## Sign tx

Dapp could use `sign` method to sign tx with Synapse, it will bring up a notification window with the password form. After user enter correct password, `sign` method will return signed tx.

### Method:

```js
ckb.sign

const signedTx = await sign(params);
```

`params` has the following structure which is the same as `ckb.send`：

```js
// ? means optional
params: {
  tx: TX_JSON, // required. ckb raw transaction, refer to below example
  meta?: { // optional
    capacity: number;
    to: string;
    from?: string;
    fee?: number;
    data?: string;
  }
}
```

### Return value:

Will return:
<details>
  <summary>Click to expand!</summary>

Currently there is no error returned.
```js
{
  type: 'sign',
  success: true,
  message: 'tx is signed',
  data: {
    tx: TX_JSON_SIGNED
  }
}
``` 
</details>


### Example:

1. Prepare for you data to be signed
<details>
  <summary>Click to expand!</summary>
 
```js
const rawTx = {
  version: '0x0',
  cellDeps: [
    {
      depType: 'depGroup',
      outPoint: {
        txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
        index: '0x0',
      },
    },
    {
      depType: 'code',
      outPoint: {
        txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
        index: '0x0',
      },
    },
  ],
  headerDeps: [],
  inputs: [
    {
      since: '0x0',
      previousOutput: {
        txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
        index: '0x1',
      },
    },
  ],
  outputs: [
    {
      capacity: '0x34e62ce00',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
      },
      type: {
        hashType: 'data',
        codeHash: '0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869',
        args: '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2',
      },
    },
    {
      capacity: '0x2bb8a24afc0',
      lock: {
        hashType: 'type',
        codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
        args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
      },
      type: null,
    },
  ],
  outputsData: ['0x40420f00000000000000000000000000', '0x'],
  witnesses: [
    {
      lock: '',
      inputType: '',
      outputType: '',
    },
  ],
};

const rawTxWithMeta = {
  meta: {}, // optional
  tx: rawTx,
};

```
</details>

2. Sign:

```js
const txResult = await ckb.sign(rawTxWithMeta);
```

3. Will pop up a notification window to prompt user to enter Synapse wallet password. The `sign` method will return value after user enter password.

**TX is signed successfully:**

Note the value inside witnesses array, it's the signed result.

Will return:
<details>
  <summary>Click to expand!</summary>
 
```js
{
  type: 'sign',
  target: 'injectedScript',
  success: true,
  message: 'tx is signed',
  data: {
    tx: {
      version: '0x0',
      cellDeps: [
        {
          depType: 'depGroup',
          outPoint: {
            txHash: '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708',
            index: '0x0',
          },
        },
        {
          depType: 'code',
          outPoint: {
            txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
            index: '0x0',
          },
        },
      ],
      headerDeps: [],
      inputs: [
        {
          since: '0x0',
          previousOutput: {
            txHash: '0xe3f981cf8ba46b3c664ca0d823767f7f059ed31139cc54f76182d7e2129cb0e0',
            index: '0x1',
          },
        },
      ],
      outputs: [
        {
          capacity: '0x34e62ce00',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
          },
          type: {
            hashType: 'data',
            codeHash: '0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869',
            args: '0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2',
          },
        },
        {
          capacity: '0x2bb8a24afc0',
          lock: {
            hashType: 'type',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            args: '0x9b84887ab2ea170998cff9895675dcd29cd26d4d',
          },
          type: null,
        },
      ],
      outputsData: ['0x40420f00000000000000000000000000', '0x'],
      witnesses: [
        '0x550000001000000055000000550000004100000062c5c2e4ff80aea4914ecb6c11a7b8f820d2b914185d84780899ca2f69f553cb30de239ea75c98c451e4e8650cdd325a4a75c93c8fd750c3a71547ba68c50d4401',
      ],
    },
  },
}
```
</details>
