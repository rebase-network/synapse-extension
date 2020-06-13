# Synapse sdk

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
const txInfo = {
  "meta": {
    "from": "ckt1qyqgadxhtq27ygrm62dqkdj32gl95j8gl56qum0yyn",
    "to": "ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae",
    "capacity": 100,
    "data": "0x68656c6c6f20636b62"  // hello ckb
  }
}

const txResult = await ckb.send(txInfo);
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

