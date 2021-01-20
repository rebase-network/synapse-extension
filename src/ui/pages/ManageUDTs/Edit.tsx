import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import PageNav from '@src/ui/Components/PageNav';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import UDTForm from './Form';

const useStyles = makeStyles({
  container: {
    margin: 20,
    fontSize: 12,
  },
  link: {},
});

interface AppProps {
  match?: any;
}

export default function UDTEdit(props: AppProps) {
  const history = useHistory();
  const classes = useStyles();
  const intl = useIntl();
  const typeHashPropsFromUrl = _.get(props, 'match.params.typeHash', '');
  const [udt, setUdt] = React.useState();

  React.useEffect(() => {
    const getUDT = async () => {
      const { udts = [] } = await browser.storage.local.get('udts');
      const result = _.find(udts, (udtItem) => udtItem.typeHash === typeHashPropsFromUrl);
      setUdt(result);
    };
    getUDT();
  }, []);

  const onSubmit = async (values, { resetForm }) => {
    const { name, typeHash, decimal, symbol } = values;
    const { udts } = await browser.storage.local.get('udts');
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

  if (!udt) return <div />;

  const initialValues = udt;
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
      <PageNav to="/udts" title="Edit UDT" />
      <div className={classes.container}>{formElem}</div>
    </div>
  );
}
