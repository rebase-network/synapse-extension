import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import PageNav from '@src/ui/Components/PageNav';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import UDTForm from './Form';

const useStyles = makeStyles({
  container: {
    margin: 20,
    fontSize: 12,
  },
});

export default function UDTCreate(props: any) {
  const classes = useStyles();
  const intl = useIntl();
  const history = useHistory();
  const { routeProps } = props;
  const searchParams = queryString.parse(routeProps?.location?.search);

  const onSubmit = async (values, { resetForm }) => {
    const { name, typeHash, decimal, symbol } = values;
    const { udts = [] } = await browser.storage.local.get('udts');
    const udtObj = { name, typeHash, decimal, symbol };

    const udtInx = _.findIndex(udts, (udtItem) => {
      return udtItem.typeHash === typeHash;
    });

    if (udtInx === -1) {
      udts.push(udtObj);
    } else {
      udts[udtInx] = udtObj;
    }

    await browser.storage.local.set({ udts });
    resetForm({ values: { name: '', typeHash: '', decimal: '', symbol: '' } });
    history.push('/udts');
  };

  const initialValues = {
    name: '',
    typeHash: searchParams.typeHash,
    decimal: '8',
    symbol: '',
  };
  const formElem = (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(intl.formatMessage({ id: 'Required' })),
        typeHash: Yup.string().required(intl.formatMessage({ id: 'Required' })),
        decimal: Yup.string()
          .required(intl.formatMessage({ id: 'Required' }))
          .matches(/^[1-9][0-9]*$|^0$/, intl.formatMessage({ id: 'Invalid number' })),
        symbol: Yup.string().required(intl.formatMessage({ id: 'Required' })),
      })}
    >
      {UDTForm}
    </Formik>
  );

  return (
    <div>
      <PageNav to="/udts" title="Add UDT" />
      <div className={classes.container}>{formElem}</div>
    </div>
  );
}
