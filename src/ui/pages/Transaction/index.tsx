import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";

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

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.SEND_TX_BY_AMOUNT) {
        // setAddress(message.address);
        console.log("message", JSON.stringify(message));
        // message {"fromAddress":"ckt1qyqt9ed4emcxyfed77ed0dp7kcm3mxsn97ls38jxjw","toAddress":"ckt1qyqt9ed4emcxyfed77ed0dp7kcm3mxsn97ls38jxjw","amount":"1000","fee":"1000","messageType":"SEND_TX_BY_AMOUNT"}

      }
    })
    // setLoading(true);
  }, [])

  const onSubmit = async(values) => {
    // await new Promise(resolve => setTimeout(resolve, 500));
    console.log(values)
    //消息发送到Background.ts
    //network - TODO
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.SEND_TX })
    setSuccess(true)
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Send CKB' testId="sendtx-form-title" />
      {successNode}

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
