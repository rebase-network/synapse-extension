// import Yup from 'yup';
import * as Yup from 'yup';

import {passwordValidator, shortAddressValidator} from "../validator"

describe('validator test', () => {
  it('check string', async() => {
    // const result = aggregateUDT(udtsLiveCells as UDTInfo[]);
    // expect(result).toEqual(udtsCapacity);

    let schema = Yup.string();
    const result = await schema.isValid('hi');

    expect(result).toEqual(true);

  });

  it('check password', async() => {

    let check = passwordValidator()

    const cast1 = await check.isValid('1');
    expect(cast1).toEqual(false);

    const cast2 = await check.isValid(111111);
    expect(cast2).toEqual(true);

    const cast3 = await check.isValid("");
    expect(cast3).toEqual(false);

    const cast4 = await check.isValid('1'.repeat(21));
    expect(cast4).toEqual(false);

    const castn = await check.isValid('111111');
    expect(castn).toEqual(true);
  });


  it('check address', async() => {

    let addr = shortAddressValidator()

    const cast1 = await addr.isValid('');
    expect(cast1).toEqual(false);

    const cast2 = await addr.isValid(111111);
    expect(cast2).toEqual(false);

    const cast3 = await addr.isValid('1');
    expect(cast3).toEqual(false);

    const cast4 = await addr.isValid('ccc1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70');
    expect(cast4).toEqual(false);

    const fakeAddr = "a".repeat(46)
    console.log(/fake/, fakeAddr)
    const cast5 = await addr.isValid(fakeAddr);
    expect(cast5).toEqual(false);

    const cast6 = await addr.isValid('ckb'+ 'a'.repeat(43));
    expect(cast6).toEqual(true);

    const testAddr = await addr.isValid('ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70');
    expect(testAddr).toEqual(true);

    const mainAddr = await addr.isValid('ckb1qyqw9e65hc90s5e7fxleja6mkn0evfcm9gws6vz49g');
    expect(mainAddr).toEqual(true);
  });
});
