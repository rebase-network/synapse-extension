import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MESSAGE_TYPE, MIN_CELL_CAPACITY } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../App';
import PageNav from '../../Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    'margin-right': 10,
    textTransform: 'none',
  },
  textField: {},
});

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
  const classes = useStyles();
  const {
    values,
    placeholder,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label="To"
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
        label="Capacity"
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
        label="Fee"
        id="fee"
        name="fee"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.fee ? values.fee : 0.0001}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fee}
        helperText={errors.fee && touched.fee && errors.fee}
        margin="normal"
        variant="outlined"
        data-testid="field-fee"
      />
      <TextField
        label="Password"
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
        Send
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
        to={'/address'}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default function (props: AppProps, state: AppState) {
  const history = useHistory();
  const { network } = React.useContext(AppContext);
  const [success, setSuccess] = React.useState(false);
  const [valAddress, setValAddress] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.TO_TX_DETAIL) {
        chrome.runtime.sendMessage({
          message,
          messageType: MESSAGE_TYPE.REQUEST_TX_DETAIL,
        });
        history.push('/tx-detail');
      }
    });
    // setLoading(true);
  }, []);

  const onSubmit = async (values) => {
    const toAddress = values.address;
    validateAddress(toAddress, network);

    chrome.runtime.sendMessage({
      ...values,
      network,
      messageType: MESSAGE_TYPE.RESQUEST_SEND_TX,
    });
    setSuccess(true);
  };

  //check the current network and address
  const validateAddress = (address, network) => {
    if (address.length !== 46) {
      setValAddress(false);
      return;
    }
    if (network == 'testnet' && !address.startsWith('ckt')) {
      setValAddress(false);
      return;
    }
    if (network == 'mainnet' && !address.startsWith('ckb')) {
      setValAddress(false);
      return;
    }
  };

  let successNode = null;
  if (success) successNode = <div className="success">Successfully</div>;
  let validateNode = null;
  if (!valAddress) validateNode = <div className="success">Invalid Address</div>;

  const classes = useStyles();
  return (
    <div>
      <PageNav to="/address" title="Send CKB" />
      <div className={classes.container}>
        {successNode}
        {validateNode}
        <Formik
          initialValues={{ address: '', capacity: '', fee: '0.0001', password: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            address: Yup.string().required('Required'),
            capacity: Yup.number()
              .required('Required')
              .min(MIN_CELL_CAPACITY, `Should be greater than ${MIN_CELL_CAPACITY}`),
            fee: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
