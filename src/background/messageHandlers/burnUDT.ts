import { redeemSudtTx } from '@src/wallet/transaction/redeemSudtTransaction';
import { CKB_TOKEN_DECIMALS } from '@src/utils/constants';
import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';

const burnUdtTX = async (amount) => {
  const { currentWallet } = await browser.storage.local.get(['currentWallet']);
  const from = currentWallet.address;
  const fee = 10000;
  console.log('burnUdtTX from, amount: ', from, amount);
  const { tx } = await redeemSudtTx(from, amount * CKB_TOKEN_DECIMALS, fee);
  return tx;
};

export default async (port, data) => {
  const { amount } = data;
  const tx = await burnUdtTX(amount);

  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_BUTN_UDT,
    requestId: 'burnUDT',
    success: true,
    message: 'generate burn udt tx successfully',
    target: WEB_PAGE,
    data: tx,
  });
};
