import CKB from '@nervosnetwork/ckb-sdk-core';
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils';
import configService from '@src/config';

const ckb = new CKB(configService.CKB_RPC_ENDPOINT);
export const EMPTY_TX_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

const txListObjects = [
  {
    block_number: '0x20b75',
    io_index: '0x0',
    io_type: 'output',
    tx_hash: '0xbc6f08a52e02ff06b825d0bf85fd150c194b2fb2fb149c13ca6eab909b999ffc',
    tx_index: '0x1',
  },
  {
    block_number: '0x20b95',
    io_index: '0x0',
    io_type: 'input',
    tx_hash: '0x1cb41bd161ae75f94e9019afa0e7f98297f5404272dfe8de268f977cbbebc1a2',
    tx_index: '0x1',
  },
  {
    block_number: '0x20b95',
    io_index: '0x1',
    io_type: 'output',
    tx_hash: '0x1cb41bd161ae75f94e9019afa0e7f98297f5404272dfe8de268f977cbbebc1a2',
    tx_index: '0x1',
  },
];

export const txListObjCluster = (txObjList: any): any => {
  //  数据分组
  const clusterItem: object = {};
  const cluster: [] = [];
  txObjList.forEach((element) => {
    if (!clusterItem[element.tx_hash]) {
      cluster.push({
        tx_hash: element.tx_hash,
        dataItem: [element],
      } as never);
      clusterItem[element.tx_hash] = element;
    } else {
      cluster.forEach((ele) => {
        if ((ele as any).tx_hash === element.tx_hash) {
          (ele as any).dataItem.push(element);
        }
      });
    }
  });
  return cluster;
};

function isContained(io_type, dataItem_List) {
  function findIn(dataItem) {
    return dataItem.io_type === io_type;
  }
  const dataItem = dataItem_List.find(findIn);
  return dataItem;
}
const hrpSize = 6;
const extractPayloadFromAddress = (address: string) => {
  const addressPayload = ckbUtils.parseAddress(address, 'hex');
  return `0x${addressPayload.slice(hrpSize)}`;
};

const getReceivedCapacity = (args, outputs) => {
  let capacity = BigInt(0);
  for (let index = 0; index < outputs.length; index++) {
    if (outputs[index].lock.args === args) {
      capacity += BigInt(outputs[index].capacity);
    }
  }
  return capacity;
};

const getSendCapacity = (args, outputs) => {
  let capacity = BigInt(0);
  for (let index = 0; index < outputs.length; index++) {
    if (outputs[index].lock.args !== args) {
      capacity += BigInt(outputs[index].capacity);
    }
  }
  return capacity;
};

const address = 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae';
describe('get_transaction test', () => {
  it('01- getCapacityByLockHash', async () => {
    const newTxs = [];

    const txListResult = txListObjCluster(txListObjects);
    for (let index = 0; index < txListResult.length; index++) {
      const newTx: any = {};

      let isContainedInput = null;
      let isContainedOutput = null;

      const txObj = txListResult[index];

      newTx.address = address;
      newTx.hash = txObj.tx_hash;
      const dataItem0 = txObj.dataItem[0];
      if (dataItem0.block_number) {
        newTx.blockNum = parseInt(dataItem0.block_number, 16);
        const header = await ckb.rpc.getHeaderByNumber(dataItem0.block_number);
        if (!header) continue;
        newTx.timestamp = parseInt(header.timestamp, 16);
      }
      const { transaction } = await ckb.rpc.getTransaction(txObj.tx_hash);
      const { outputs } = transaction;
      const args = extractPayloadFromAddress(address);

      isContainedInput = isContained('input', txObj.dataItem);
      isContainedOutput = isContained('output', txObj.dataItem);
      if (isContainedInput == null && isContainedOutput != null) {
        const receiveCap = getReceivedCapacity(args, outputs);
        newTx.capacity = receiveCap;
        newTx.tag = 'Received';
      }

      if (isContainedInput != null && isContainedOutput != null) {
        const sendCapacity = getSendCapacity(args, outputs);
        newTx.capacity = sendCapacity;
        newTx.tag = 'Send';
      }
      newTxs.push(newTx);
    }
  });
});
