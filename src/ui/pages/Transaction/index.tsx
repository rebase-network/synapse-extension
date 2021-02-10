/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import {
  Button,
  TextField,
  ListItem,
  ListItemText,
  Slider,
  Typography,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import PageNav from '@ui/Components/PageNav';
import Modal from '@ui/Components/Modal';
import TxDetail from '@ui/Components/TxDetail';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MESSAGE_TYPE,
  CKB_TOKEN_DECIMALS,
  MIN_TRANSFER_CELL_CAPACITY,
  SUDT_MIN_CELL_CAPACITY,
  LockType,
} from '@common/utils/constants';
import {
  truncateAddress,
  shannonToCKBFormatter,
  truncateHash,
  ckbToshannon,
} from '@common/utils/formatters';
import { getUnspentCapacity } from '@common/utils/apis';
import { addressToScript } from '@keyper/specs';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils';
import getLockTypeByCodeHash from '@background/wallet/transaction/getLockTypeByCodeHash';

const useStyles = makeStyles({
  container: {
    margin: '0px 30px 20px',
  },
  button: {
    'margin-top': '0.6rem',
  },
  feeRate: {
    color: '#666',
    'margin-top': '0.6rem',
    'font-size': '0.8rem',
  },
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

const InnerForm = (props: any) => {
  const classes = useStyles();
  const intl = useIntl();
  const [contacts, setContacts] = React.useState([]);
  const [checkMsg, setCheckMsg] = React.useState('');
  const [unspentCapacity, setUnspentCapacity] = React.useState(-1);
  const [feeRate, setFeeRate] = React.useState(1000);
  const { values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldError } = props;
  React.useEffect(() => {
    browser.storage.local.get('contacts').then((result) => {
      if (Array.isArray(result.contacts)) {
        setContacts(result.contacts);
      }
    });

    browser.storage.local.get('currentWallet').then(async (result) => {
      const lockHash = result.currentWallet?.lock;
      if (!lockHash) return;
      const unspentCapacityResult = await getUnspentCapacity(lockHash);
      setUnspentCapacity(unspentCapacityResult);
    });
  }, []);

  let errMsg = errors.capacity && touched.capacity && errors.capacity;
  if (errMsg === undefined) {
    if (checkMsg !== '') {
      errMsg = checkMsg;
    }
  }

  const handleBlurCapacity = async (event) => {
    if (errors.address) return;
    setCheckMsg('');
    handleBlur(event);

    const { address, typeHash, udt = 0, decimal } = values;

    // secp256k1
    const capacity = event.target.value;

    let toLockScript;

    try {
      toLockScript = addressToScript(address);
    } catch (error) {
      setFieldError('address', intl.formatMessage({ id: 'Invalid address' }));
      return;
    }
    const toLockType = getLockTypeByCodeHash(toLockScript.codeHash);
    if (!typeHash) {
      if (toLockType === LockType.Secp256k1) {
        // every cell's capacity gt 61
        if (Number(capacity) < Number(61)) {
          const checkMsgId = "The transaction's ckb capacity cannot be less than 61 CKB";
          const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
          setCheckMsg(checkMsgI18n);
          return;
        }
      }
      // check anypay cell's capacity
      if (toLockType === LockType.AnyPay) {
        const toLockHash = scriptToHash(toLockScript);
        const liveCapacity = await getUnspentCapacity(toLockHash);
        if (!liveCapacity && Number(capacity) < Number(61)) {
          const checkMsgId = "The transaction's ckb capacity cannot be less than 61 CKB";
          const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
          setCheckMsg(checkMsgI18n);
          return;
        }
      }

      if (unspentCapacity > 0) {
        if (unspentCapacity < Number(capacity) * CKB_TOKEN_DECIMALS) {
          const checkMsgId = 'lack of capacity, available capacity is';
          const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
          setCheckMsg(` ${checkMsgI18n + shannonToCKBFormatter(unspentCapacity.toString())} CKB`);
          return;
        }
        const chargeCapacity = unspentCapacity - Number(capacity) * CKB_TOKEN_DECIMALS;
        if (chargeCapacity < 61 * CKB_TOKEN_DECIMALS) {
          const checkMsgId =
            'the remaining capacity is less than 61, if continue it will be destroyed, remaining capacity is';
          const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
          setCheckMsg(` ${checkMsgI18n + shannonToCKBFormatter(chargeCapacity.toString())} CKB`);
        }
      }
    } else {
      if (!unspentCapacity) {
        const checkMsgId =
          'lack of capacity, ckb capacity cannot be less than 142 CKB, available capacity is';
        const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
        setCheckMsg(`${checkMsgI18n + shannonToCKBFormatter('0')} CKB`);
      }

      if (ckbToshannon(capacity, decimal) > BigInt(udt)) {
        const checkMsgId = "The transaction's sudt amount cannot be more than have";
        const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
        setCheckMsg(checkMsgI18n);
      }
      if (BigInt(unspentCapacity) < BigInt((SUDT_MIN_CELL_CAPACITY + 1) * CKB_TOKEN_DECIMALS)) {
        const checkMsgId =
          'lack of capacity, ckb capacity cannot be less than 142 CKB, available capacity is';
        const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
        setCheckMsg(` ${checkMsgI18n + shannonToCKBFormatter(unspentCapacity.toString())} CKB`);
      }
    }
  };

  const { name, typeHash } = values;
  let sudtElem;
  let dataElem;
  if (!name && !typeHash) {
    dataElem = (
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Data' })}
        id="field-data"
        name="data"
        type="text"
        fullWidth
        value={values.data}
        onChange={handleChange}
        error={!!errors.data}
        helperText={errors.data && touched.data && errors.data}
        margin="normal"
        variant="outlined"
      />
    );
  }

  if (name === 'undefined' && typeHash === '') {
    sudtElem = null;
  } else if (name === 'undefined' && typeHash !== '') {
    // sudt show
    sudtElem = (
      <div>
        <ListItem>
          <ListItemText primary="UDT Hash" secondary={truncateHash(typeHash)} />
        </ListItem>
      </div>
    );
  } else if (name !== 'undefined' && typeHash !== '') {
    // sudt show
    sudtElem = (
      <div>
        <ListItem>
          <ListItemText primary="UDT Name" secondary={name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="UDT Hash" secondary={truncateHash(typeHash)} />
        </ListItem>
      </div>
    );
  }

  const handleSliderChangeCommitted = async (event, feeRateValue) => {
    setFeeRate(feeRateValue);
    setFieldValue('feeRate', feeRateValue);
  };

  return (
    <>
      <div>{sudtElem}</div>

      <Autocomplete
        id="address"
        size="small"
        onChange={(event, newValue) => {
          setFieldValue('address', newValue.address);
        }}
        options={contacts}
        getOptionLabel={(option) => option.address}
        renderOption={(option) => (
          <>
            {`${option.name}: `}
            {truncateAddress(option.address)}
          </>
        )}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={intl.formatMessage({ id: 'To' })}
            name="address"
            value={values.address}
            onChange={handleChange}
            margin="normal"
            InputProps={{ ...params.InputProps, type: 'search' }}
            variant="outlined"
            error={!!errors.address}
            helperText={errors.address && touched.address && errors.address}
          />
        )}
        style={{ width: 300 }}
      />
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Amount' })}
        name="capacity"
        type="text"
        placeholder={`Should be >= ${MIN_TRANSFER_CELL_CAPACITY}`}
        fullWidth
        value={values.capacity}
        onChange={handleChange}
        onBlur={handleBlurCapacity}
        error={!!errors.capacity}
        helperText={errMsg}
        margin="normal"
        variant="outlined"
        id="field-capacity"
      />
      {dataElem}
      <div className={classes.feeRate}>
        <Typography gutterBottom>
          <FormattedMessage id="Fee Rate" />
          <span>:&nbsp;</span>
          <span>{feeRate}</span>
          <span>&nbsp;Shn/KB</span>
        </Typography>

        <Grid container spacing={2}>
          <Grid item>
            <Typography gutterBottom>
              <FormattedMessage id="Slower" />
            </Typography>
          </Grid>
          <Grid item xs>
            <Slider
              name="feeRate"
              valueLabelDisplay="auto"
              step={1000}
              aria-label="feeRate"
              defaultValue={1000}
              min={1000}
              max={5000}
              onChangeCommitted={handleSliderChangeCommitted}
            />
          </Grid>
          <Grid item>
            <Typography gutterBottom>
              <FormattedMessage id="Faster" />
            </Typography>
          </Grid>
        </Grid>
      </div>
      <TextField
        size="small"
        label={intl.formatMessage({ id: 'Password' })}
        name="password"
        type="password"
        fullWidth
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        id="field-password"
      />
    </>
  );
};

export default () => {
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(window.location.search);

  const [sending, setSending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [errMsgText, setErrMsgText] = React.useState('');
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
    const listener = (message) => {
      const messageHandled = _.has(message, 'success');
      if (messageHandled && message.type === MESSAGE_TYPE.SEND_TX_OVER) {
        if (message.success) {
          onSelectTx(message?.data?.tx);
        } else {
          setErrMsg('The transaction failed to send, please try again later');
        }
      }

      if (messageHandled && message.type === MESSAGE_TYPE.SEND_TX_ERROR) {
        setErrMsgText(message.message);
      }
      setSending(false);
    };
    browser.runtime.onMessage.addListener(listener);

    return () => browser.runtime.onMessage.removeListener(listener);
  });

  const onSubmit = async (values) => {
    setSending(true);
    browser.runtime.sendMessage({
      ...values,
      type: MESSAGE_TYPE.REQUEST_SEND_TX,
    });
  };

  let sendingNode;
  if (sending) {
    sendingNode = (
      <div className={classes.alert}>
        {intl.formatMessage({ id: 'The transaction is sending, please wait for seconds...' })}
      </div>
    );
  }

  let errNode;

  if (errMsg || errMsgText) {
    errNode = (
      <div className={classes.error}>
        <div>{errMsg && intl.formatMessage({ id: errMsg })}</div>
        <div>{errMsgText}</div>
      </div>
    );
  }

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
    feeRate: 4096,
    password: '',
    ...searchParams,
  };
  if (searchParams.to) {
    initialValues.address = searchParams.to as string;
  }
  const btnTextId = sending ? 'Submitting' : 'Send';

  const outsideForm = (props: any) => {
    const { handleSubmit } = props;
    return (
      <Form className="form-sendtx" id="form-sendtx" onSubmit={handleSubmit} aria-label="form">
        <InnerForm {...props} />

        <Button
          type="submit"
          id="submit-button"
          disabled={sending}
          color="primary"
          variant="contained"
          className={classes.button}
          data-testid="submit-button"
        >
          {intl.formatMessage({ id: btnTextId })}
        </Button>
      </Form>
    );
  };

  const validate = (values) => {
    const { address } = values;
    const errors = {} as any;
    try {
      addressToScript(address);
    } catch (error) {
      errors.address = intl.formatMessage({ id: 'Invalid address' });
    }
    return errors;
  };
  return (
    <div>
      <PageNav to="/address" title={intl.formatMessage({ id: 'Send Transaction' })} />
      <div className={classes.container}>
        {sendingNode}
        {errNode}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          validationSchema={Yup.object().shape({
            address: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            capacity: Yup.number()
              .required(intl.formatMessage({ id: 'Required' }))
              .min(
                MIN_TRANSFER_CELL_CAPACITY,
                `${intl.formatMessage({
                  id: 'Should be greater than ',
                })}${MIN_TRANSFER_CELL_CAPACITY}`,
              ),
            password: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {outsideForm}
        </Formik>
      </div>
      {txModal}
    </div>
  );
};
