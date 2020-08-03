import { signTx } from '@src/keyper/keyperwallet';

export const signTxFromMsg = async (request) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  const {
    data: { tx: rawTx, meta },
    password,
  } = request;
  const config = meta?.config || { index: 0, length: -1 };
  const signedTx = await signTx(currentWallet?.lock, password.trim(), rawTx, config);
  return signedTx;
};
