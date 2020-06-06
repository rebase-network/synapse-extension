# Synapse sdk

Synapse will inject a object `ckb` into browser `window` object, so you can use method under ckb directly. The following docs will talk about how to use the methods provided by ckb.

**Note**: The sdk will be changed frequently before we publish the production version. If you have any questions, problems and suggestions, do not hesitate to create an issue.

## Send tx

Dapp could use `send` method to send tx with Synapse, it will bring up a notification window with the send tx form.

Method:

```js
send(params);
```

Return value:

Currentl there is no return value, it just bring up Synapse extension send tx page. We plan to return a `promised` value.

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
  fee: 0.001,
});
```
