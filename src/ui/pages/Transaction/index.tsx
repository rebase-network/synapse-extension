import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import {
  Button,
  TextField,
  ListItem,
  ListItemText,
  Slider,
  Tooltip,
  Typography,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppContext } from '@ui/utils/context';
import {
  MESSAGE_TYPE,
  CKB_TOKEN_DECIMALS,
  MIN_TRANSFER_CELL_CAPACITY,
  SUDT_MIN_CELL_CAPACITY,
  LockType,
} from '@common/utils/constants';
import PageNav from '@ui/Components/PageNav';
import Modal from '@ui/Components/Modal';
import TxDetail from '@ui/Components/TxDetail';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  truncateAddress,
  shannonToCKBFormatter,
  truncateHash,
  ckbToshannon,
} from '@common/utils/formatters';
import { getUnspentCapacity } from '@common/utils/apis';
import { addressToScript } from '@keyper/specs';
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils';

import calculateTxFee from '@common/utils/fee/calculateFee';
import { genDummyTransaction } from '@background/wallet/transaction/sendTransaction';
import { showAddressHelper } from '@common/utils/wallet';
import getLockTypeByCodeHash from '@background/wallet/transaction/getLockTypeByCodeHash';

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
  setFieldValue: any;
}

interface AppState {}

interface TooltipProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

const InnerForm = (props: AppProps) => {
  const classes = useStyles();
  const intl = useIntl();
  const [contacts, setContacts] = React.useState([]);
  const [checkAddressMsg, setCheckAddressMsg] = React.useState('');
  const [checkMsg, setCheckMsg] = React.useState('');
  const [unspentCapacity, setUnspentCapacity] = React.useState(-1);

  const [toAddress, setToAddress] = React.useState('');
  const [txCapacity, setTxCapacity] = React.useState('');
  const [txData, setTxData] = React.useState('');
  const [feeRate, setFeeRate] = React.useState(1000);

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

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

  let errAddressMsg = errors.address && touched.address && errors.address;
  if (errAddressMsg === undefined) {
    if (checkAddressMsg !== '') {
      errAddressMsg = checkAddressMsg;
    }
  }

  const handleBlurCapacity = async (event) => {
    setCheckMsg('');
    setCheckAddressMsg('');
    handleBlur(event);

    const { address, typeHash, udt = 0, decimal } = values;
    // check address
    try {
      addressToScript(address);
    } catch (error) {
      const checkMsgId = 'Invalid address';
      const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
      setCheckAddressMsg(checkMsgI18n);
      return;
    }

    // secp256k1
    const capacity = event.target.value;
    setTxCapacity(capacity);

    const toLockScript = addressToScript(address);
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
          setCheckMsg(`${checkMsgI18n + shannonToCKBFormatter(unspentCapacity.toString())} CKB`);
          return;
        }
        const chargeCapacity = unspentCapacity - Number(capacity) * CKB_TOKEN_DECIMALS;
        if (chargeCapacity < 61 * CKB_TOKEN_DECIMALS) {
          const checkMsgId =
            'the remaining capacity is less than 61, if continue it will be destroyed, remaining capacity is';
          const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
          setCheckMsg(`${checkMsgI18n + shannonToCKBFormatter(chargeCapacity.toString())} CKB`);
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
        setCheckMsg(`${checkMsgI18n + shannonToCKBFormatter(unspentCapacity.toString())} CKB`);
      }
    }
  };

  const { name, typeHash } = values;
  let sudtElem;
  let dataElem;
  if (!name && !typeHash) {
    dataElem = (
      <TextField
        label={intl.formatMessage({ id: 'Data' })}
        id="field-data"
        name="data"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.data}
        onChange={handleChange}
        onBlur={(event) => {
          setTxData(event.target.value);
        }}
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

  function ValueLabelComponent(props: TooltipProps) {
    const { children, open, value } = props;

    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  const sliderMarks = [
    {
      value: 500,
      label: '500',
    },
    {
      value: 1000,
      label: '1000',
    },
    {
      value: 2000,
      label: '2000',
    },
    {
      value: 3000,
      label: '3000 shn/kb',
    },
  ];

  const handleSliderChangeCommitted = async (event, newValue) => {
    setFeeRate(newValue);
  };

  React.useEffect(() => {
    if (!toAddress || !txCapacity) {
      return;
    }

    (async () => {
      const cwStorage = await browser.storage.local.get('currentWallet');
      const currNetworkStorage = await browser.storage.local.get('currentNetwork');
      if (!cwStorage.currentWallet) return;
      const { script, lock, type } = cwStorage.currentWallet;

      const fromAddress = showAddressHelper(currNetworkStorage.currentNetwork.prefix, script);

      const dummyTxObj = await genDummyTransaction(
        fromAddress,
        toAddress,
        txCapacity,
        10,
        lock,
        type,
        txData,
      );

      if (!dummyTxObj) return;

      const feeHex = calculateTxFee(dummyTxObj, BigInt(feeRate));
      const newFee = parseInt(feeHex.toString(), 16);
      const fee = shannonToCKBFormatter(newFee.toString());

      setFieldValue('fee', fee);
    })();
  }, [feeRate, setFieldValue, toAddress, txCapacity, txData]);

  return (
    <Form className="form-sendtx" id="form-sendtx" onSubmit={handleSubmit} aria-label="form">
      <div>{sudtElem}</div>

      <Autocomplete
        id="address"
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
            onBlur={(event) => {
              setToAddress(event.target.value);
            }}
            InputProps={{ ...params.InputProps, type: 'search' }}
            variant="outlined"
            error={!!errors.address}
            helperText={checkAddressMsg}
          />
        )}
        style={{ width: 300 }}
      />
      <TextField
        label={intl.formatMessage({ id: 'Capacity' })}
        name="capacity"
        type="text"
        placeholder={`Should be >= ${MIN_TRANSFER_CELL_CAPACITY}`}
        fullWidth
        className={classes.textField}
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

      <div>
        <Typography gutterBottom>
          <FormattedMessage id="Fee Rate" />
        </Typography>

        <Grid container spacing={2}>
          <Grid item>
            <Typography gutterBottom>
              <FormattedMessage id="Slower" />
            </Typography>
          </Grid>
          <Grid item xs>
            <Slider
              ValueLabelComponent={ValueLabelComponent}
              valueLabelDisplay="auto"
              step={500}
              marks={sliderMarks}
              aria-label="feeRate"
              defaultValue={1000}
              min={500}
              max={3000}
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
        label={intl.formatMessage({ id: 'Fee' })}
        id="field-fee"
        name="fee"
        type="text"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        className={classes.textField}
        value={values.fee}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fee}
        helperText={errors.fee && touched.fee && errors.fee}
        margin="normal"
        variant="outlined"
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
        id="field-password"
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

export default () => {
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(window.location.search);

  const { network } = React.useContext(AppContext);
  const [sending, setSending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [errMsgText, setErrMsgText] = React.useState('');
  const [errCode, setErrCode] = React.useState('');
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
        setErrCode(message.errCode);
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
      network,
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
    fee: 0.00001,
    password: '',
    ...searchParams,
  };
  if (searchParams.to) {
    initialValues.address = searchParams.to as string;
  }

  return (
    <div>
      <PageNav to="/address" title={intl.formatMessage({ id: 'Send Transaction' })} />
      <div className={classes.container}>
        {sendingNode}
        {errNode}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
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
            fee: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            password: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {InnerForm}
        </Formik>
      </div>
      {txModal}
    </div>
  );
};
