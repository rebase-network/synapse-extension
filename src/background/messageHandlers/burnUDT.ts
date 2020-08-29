import { redeemSudtTx } from '@src/wallet/transaction/redeemSudtTransaction';
import { CKB_TOKEN_DECIMALS } from '@src/utils/constants';
import { MESSAGE_TYPE } from '@utils/constants';
import { WEB_PAGE } from '@utils/message/constants';

const burnUdtTX = async (from, amount) => {
  const fee = 10000;
  const { tx } = await redeemSudtTx(from, amount * CKB_TOKEN_DECIMALS, fee);
  return tx;
};

export default async (port, data) => {
  const { from, amount } = data;
  const tx = await burnUdtTX(from, amount);

  port.postMessage({
    type: MESSAGE_TYPE.EXTERNAL_BUTN_UDT,
    requestId: 'burnUDT',
    success: true,
    message: 'generate burn udt tx successfully',
    target: WEB_PAGE,
    data: tx,
  });
};
