import * as React from 'react';
// import './Popup.scss';
import Title from '../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../utils/constants'
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
    <Form className="form-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label="Mnemonic"
        name="mnemonic"
        multiline
        rows="4"
        fullWidth
        className={classes.textField}
        value={values.mnemonic}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.mnemonic}
        helperText={(errors.mnemonic && touched.mnemonic) && errors.mnemonic}
        margin="normal"
        variant="outlined"
        data-testid="field-mnemonic"
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
        helperText={(errors.password && touched.password) && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-password"
      />
      <TextField
        label="Confirm Password"
        name="confirm-password"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid="field-confirm-password"
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
        Import
      </Button>
    </Form>
  );
}

export default function (props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const history = useHistory();

  const onSubmit = async(values) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_MNEMONIC })
    console.log(values)
    setSuccess(true)
    // go to address page
    history.push('/address')
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Import Mnemonic' testId="mnemonic-form-title" />
      {successNode}

      <Formik
        initialValues={{ mnemonic: "", password: "", confirmPassword: "" }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string()
            .required("Required"),
          password: Yup.string()
            .min(6)
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords don't match!")
            .required("Required")
        })}
      >
        {innerForm}
      </Formik>
    </div>
  )
}
