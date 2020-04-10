import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";
import { AppContext } from '../../App';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {

  },
  textField: {

  }
});

interface AppProps { }

interface AppState { }

export const innerForm = props => {
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
    handleReset
  } = props;

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>

      <TextField
        label="ToAddress"
        name="address"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.address}
        // helperText={(errors.password && touched.password) && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-address"
      />
      <TextField
        label="Amount"
        name="amount"
        type="text"
        placeholder="必须大于6100000000"
        fullWidth
        className={classes.textField}
        value={values.amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.amount}
        // helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid="field-amount"
      />
      <TextField
        label="Fee"
        name="fee"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.fee}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fee}
        // helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid="field-amount"
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
        // helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
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
        className={classes.button}
        data-testid="cancel-button"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default function (props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const history = useHistory();
  const { network } = React.useContext(AppContext);
  const [valAddress, setValAddress] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      //跳转到交易详细信息的页面
      if (message.messageType === MESSAGE_TYPE.TO_TX_DETAIL) {
        console.log("TO_TX_DETAIL message", JSON.stringify(message));
       
        //001-传递交易信息
        chrome.runtime.sendMessage({
          message,
          messageType: MESSAGE_TYPE.REQUEST_TX_DETAIL 
        })
        //002-跳转到页面
        history.push('/tx-detail')
      }
    })
    // setLoading(true);
  }, [])

  const onSubmit = async(values) => {

    // await new Promise(resolve => setTimeout(resolve, 500));
    console.log("onSubmit=>",values);
    console.log("network =>", network);

    //check the address
    const toAddress = values.address;
    validateAddress(toAddress,network);

    // 消息发送到Background.ts
    // network - TODO
    chrome.runtime.sendMessage({ ...values, network, messageType: MESSAGE_TYPE.RESQUEST_SEND_TX })
    setSuccess(true)

  }

  //check the current network and address
  const validateAddress = (address,network) => {
    if (address.length !== 46) {
        setValAddress(false);
        return;
    }
    if (network == "testnet" &&  !address.startsWith('ckt')){
        setValAddress(false);
        return;
    }
    if (network == "mainnet" &&  !address.startsWith('ckb')){
        setValAddress(false);
        return;
    }
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>
  let validateNode = null
  if (!valAddress) validateNode = <div className="success">Invalid Address</div>


  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Send CKB' testId="sendtx-form-title" />
      {successNode}
      {validateNode}
      <Formik
        initialValues={{ address: "", amount: "", fee: "", password: ""}}

        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          address: Yup.string()
            .required("Required"),
          amount: Yup.string()
            .required("Required"),
          fee: Yup.string()
            .required("Required"),
          password: Yup.string()
          .required("Required"),
        })}
      >
        {innerForm}
      </Formik>
    </div>
  )
}
