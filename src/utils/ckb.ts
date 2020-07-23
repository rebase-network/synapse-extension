import CKB from '@nervosnetwork/ckb-sdk-core';
import NetworkManager from '@common/networkManager';

const getCKB = async () => {
  const { nodeURL } = await NetworkManager.getCurrentNetwork();
  console.log(/nodeURL/, nodeURL);
  return new CKB(nodeURL);
};

export default getCKB;
