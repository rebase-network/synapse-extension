import { BN } from 'bn.js';
import { toHexInLittleEndian } from '@nervosnetwork/ckb-sdk-utils';
import { parseSUDT } from '@src/utils';

describe('Transaction test', async () => {
  it('test capacity value', async () => {
    const toSudtAmount = 1000000;
    const capacity = `0x${new BN(toSudtAmount).toString(16)}`;
    console.log(capacity);
    const liend = toHexInLittleEndian(BigInt(toSudtAmount), 16);
    console.log(liend);
    const intValue = parseSUDT(liend);
    console.log(intValue);
  });
});
