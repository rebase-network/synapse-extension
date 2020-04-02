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
    height: 600,
    width: 357,
    minHeight: 500,
    margin: 30,
    boxSizing: 'border-box'
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

  const onSubmit = async(values) => {
    // await new Promise(resolve => setTimeout(resolve, 500));
    // chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_MNEMONIC })
    // console.log(values)
    // setSuccess(true)
    // // go to address page
    // history.push('/address')
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Send CKB' testId="sendtx-form-title" />
      {successNode}

      <Formik
        initialValues={{ address: "", amount: "", fee: "" }}

        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          address: Yup.string()
            .required("Required"),
          amount: Yup.string()
            .required("Required"),
          fee: Yup.string()
            .required("Required")
        })}
      >
        {innerForm}
      </Formik>
    </div>
  )
}
