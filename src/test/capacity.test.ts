import { Ckb } from "../utils/constants";
// const AnyPayLockScript = require("../keyper/locks/anypay");

const CKB = require('@nervosnetwork/ckb-sdk-core').default
const ckb = new CKB(Ckb.remoteRpcUrl)

// {
//   "publicKey":"0x03f4b0e064c7d4835fc3b13022859703ac6e62c75123531062677746da85f50d12",
//   "address":"ckt1qyqtn0rh3j88v7qdge64e6dww8zwnd6kuyyq0zjjlh",
//   "type":"Secp256k1",
//   "lock":"0x1f847f27ad7ec9e441d3e494fa842801370495701858696400b2721c6177d716"
// }

describe('getCapacityByLockHash Rpc', () => {
  it('01- getCapacityByLockHash', async () => {
    
    const lockHash = "0x1f847f27ad7ec9e441d3e494fa842801370495701858696400b2721c6177d716";
    // const lockHash = "0x7a1b769ae9610b4dcb579adb647ee5a980594e1dad8fcf002137c80230dde3f5";
    const indexFrom = "0x0";
    const getTipBlockNumber = await ckb.rpc.getTipBlockNumber(); //获取创建地址之前的blockNumber
    console.log('--- getTipBlockNumber ---',getTipBlockNumber);
    const index_lock_hash = await ckb.rpc.indexLockHash(lockHash, getTipBlockNumber);
    console.log("--- index_lock_hash --- ", JSON.stringify(index_lock_hash));
  //   {
  //     "blockHash":"0x63547ecf6fc22d1325980c524b268b4a044d49cda3efbd584c0a8c8b9faaf9e1",
  //     "blockNumber":"0x0",
  //     "lockHash":"0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2"
  //  }
    const capacityDetail = await ckb.rpc.getCapacityByLockHash(lockHash);
    const capacity = BigInt(capacityDetail.capacity);
    console.log("--- capacity ---", capacity);

    const liveCell  = await ckb.rpc.getLiveCellsByLockHash(lockHash,"0x0","0xe");
    console.log("--- liveCell ---", JSON.stringify(liveCell));
    // return capacity;
  });
});

