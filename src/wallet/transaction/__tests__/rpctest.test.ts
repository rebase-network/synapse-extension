import { ckbToshannon } from '@src/utils/formatters';

jest.unmock('@nervosnetwork/ckb-sdk-core');

describe('Formatter Test', () => {

  it('test capacity value', () => {
    const capacity = '0.0003';
    const result = ckbToshannon(Number(capacity));
    console.log(result);
  });
});
