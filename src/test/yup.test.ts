import * as Yup from 'yup';

describe('yup validate', () => {
  // https://stackoverflow.com/questions/55901053/formik-jest-yup-how-to-test-validation
  // expect(async () => {}).toThrow()

  it('send tx validate', async () => {
    const okAddr = 'ckb1qyqt9ed4emcxyfed77ed0dp7kcm3mxsn97lsvzve7j';
    const okTestAddr = 'ckt1qyqt9ed4emcxyfed77ed0dp7kcm3mxsn97ls38jxjw';

    const contactSchema = Yup.object({
      address: Yup.string()
        .trim()
        .required('address Required')
        .length(46)
        .matches(/^ckb|ckt/),
      amount: Yup.number().required('amount Required').positive(),
      fee: Yup.number().required('fee Required').positive(),
      password: Yup.string().trim().required('password Required'),
    });

    const err1 = await contactSchema
      .validate({
        address: okAddr,
        amount: 35.5,
        fee: '123',
        password: ' 111 ',
      })
      .catch((err) => {
        return err;
      });

    expect(err1.errors).toBe(undefined);

    const err2 = await contactSchema
      .validate({
        address: okTestAddr,
        amount: 35.5,
        fee: '123',
        password: '   ',
      })
      .catch((err) => {
        return err;
      });

    console.log('err2 => ', err2);

    expect(err2.errors).toStrictEqual(['password Required']);

    const err3 = await contactSchema
      .validate({
        address: 'okAddr',
        amount: 35.5,
        fee: '123',
        password: ' 111 ',
      })
      .catch((err) => {
        return err;
      });

    expect(err3.errors).toStrictEqual(['address must be exactly 46 characters']);

    const err4 = await contactSchema
      .validate({
        address: 'a'.repeat(46),
        amount: 35.5,
        fee: '123',
        password: ' 111 ',
      })
      .catch((err) => {
        return err;
      });

    expect(err4.errors).toStrictEqual(['address must match the following: "/^ckb|ckt/"']);

    const err5 = await contactSchema
      .validate({
        address: 'a'.repeat(46),
        amount: 35.5,
        fee: '-123',
        password: ' 111 ',
      })
      .catch((err) => {
        return err;
      });

    expect(err5.errors).toStrictEqual(['fee must be a positive number']);
  });
});
