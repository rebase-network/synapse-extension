import * as React from 'react';
import * as browser from 'webextension-polyfill';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import * as queryString from 'query-string';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppContext } from '@ui/utils/context';
import { MESSAGE_TYPE, MIN_CELL_CAPACITY } from '@utils/constants';
import PageNav from '@ui/Components/PageNav';
import Modal from '@ui/Components/Modal';
import TxDetail from '@ui/Components/TxDetail';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    'margin-right': 10,
    textTransform: 'none',
  },
  textField: {},
  alert: {
    color: '#fff',
    padding: '6px 16px',
    'font-weight': '500',
    'background-color': '#4caf50',
    'border-radius': '4px',
  },
  error: {
    color: 'red',
  },
});

interface AppProps {
  values: any;
  placeholder: any;
  touched: any;
  errors: any;
  dirty: any;
  isSubmitting: any;
  handleChange: any;
  handleBlur: any;
  handleSubmit: any;
  handleReset: any;
}

interface AppState {}

export const innerForm = (props: AppProps) => {
  const classes = useStyles();
  const intl = useIntl();

  const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage({ id: 'To' })}
        name="address"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.address}
        helperText={errors.address && touched.address && errors.address}
        margin="normal"
        variant="outlined"
        data-testid="field-address"
      />
      <TextField
        label={intl.formatMessage({ id: 'Capacity' })}
        name="capacity"
        type="text"
        placeholder={`Should be >= ${MIN_CELL_CAPACITY}`}
        fullWidth
        className={classes.textField}
        value={values.capacity}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.capacity}
        helperText={errors.capacity && touched.capacity && errors.capacity}
        margin="normal"
        variant="outlined"
        data-testid="field-capacity"
      />
      <TextField
        label={intl.formatMessage({ id: 'Data' })}
        id="data"
        name="data"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.data}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.data}
        helperText={errors.data && touched.data && errors.data}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label={intl.formatMessage({ id: 'Fee' })}
        id="fee"
        name="fee"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.fee}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fee}
        helperText={errors.fee && touched.fee && errors.fee}
        margin="normal"
        variant="outlined"
        data-testid="field-fee"
      />
      <TextField
        label={intl.formatMessage({ id: 'Password' })}
        name="password"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-amount"
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        className={classes.button}
        data-testid="submit-button"
      >
        <FormattedMessage id="Send" />
      </Button>

      <Button
        // type="reset"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        className={classes.button}
        data-testid="cancel-button"
        component={Link}
        to="/address"
      >
        <FormattedMessage id="Cancel" />
      </Button>
    </Form>
  );
};

export default function (props) {
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(location.search);

  const { network } = React.useContext(AppContext);
  const [sending, setSending] = React.useState(false);
  const [valAddress, setValAddress] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [selectedTx, setSelectedTx] = React.useState('');

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const onSelectTx = (tx) => {
    setSelectedTx(tx);
    openModal();
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      const messageHandled = _.has(message, 'success');

      if (messageHandled && message.type === MESSAGE_TYPE.SEND_TX_OVER) {
        setSending(false);
        if (message.success) {
          onSelectTx(message?.data?.tx);
        } else {
          setErrMsg('TX failed to send, please try again later');
        }
      }
    });
    // setLoading(true);
  });

  // check the current network and address
  const validateAddress = (address, networkType) => {
    if (address.length !== 46) {
      setValAddress(false);
      return;
    }
    if (networkType === 'testnet' && !address.startsWith('ckt')) {
      setValAddress(false);
      return;
    }
    if (networkType === 'mainnet' && !address.startsWith('ckb')) {
      setValAddress(false);
    }
  };

  const onSubmit = async (values) => {
    setSending(true);
    const toAddress = values.address;
    validateAddress(toAddress, network);

    chrome.runtime.sendMessage({
      ...values,
      network,
      type: MESSAGE_TYPE.REQUEST_SEND_TX,
    });
  };

  let sendingNode = null;
  if (sending) {
    sendingNode = (
      <div className={classes.alert}>
        {intl.formatMessage({ id: 'The transaction is sending, please wait for seconds...' })}
      </div>
    );
  }

  let errNode = null;

  if (errMsg) {
    sendingNode = null;
    errNode = (
      <div className={classes.error}>
        {intl.formatMessage({ id: 'The transaction failed to send, please try again later' })}
      </div>
    );
  }

  let validateNode = null;
  if (!valAddress) validateNode = <div>Invalid Address</div>;

  const txModal = !selectedTx ? (
    ''
  ) : (
    <Modal open={open} onClose={closeModal}>
      <TxDetail data={selectedTx} />
    </Modal>
  );

  const initialValues = {
    address: '',
    capacity: '',
    data: '',
    fee: 0.0001,
    password: '',
    ...searchParams,
  };
  if (searchParams.to) {
    initialValues.address = searchParams.to as string;
  }

  return (
    <div>
      <PageNav to="/address" title={intl.formatMessage({ id: 'Send CKB' })} />
      <div className={classes.container}>
        {sendingNode}
        {errNode}
        {validateNode}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            address: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            capacity: Yup.number()
              .required(intl.formatMessage({ id: 'Required' }))
              .min(
                MIN_CELL_CAPACITY,
                `${intl.formatMessage({ id: 'Should be greater than ' })}${MIN_CELL_CAPACITY}`,
              ),
            fee: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            password: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
      {txModal}
    </div>
  );
}
