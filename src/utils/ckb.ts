import CKB from '@nervosnetwork/ckb-sdk-core';
import NetworkManager from '@common/networkManager';

const getCKB = async () => {
  const { nodeURL } = await NetworkManager.getCurrentNetwork();
  return new CKB(nodeURL);
};

export default getCKB;
