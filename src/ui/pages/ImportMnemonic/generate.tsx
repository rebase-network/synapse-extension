import * as React from 'react';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants';
import { useHistory } from "react-router-dom";
import { makeStyles, } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
});

interface AppProps { }

interface AppState { }

export const genForm = props => {
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
    <Form className="gen-mnemonic" id="gen-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label="Password (min 6 chars)"
        name="password"
        type="password"
        fullWidth
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={(errors.password && touched.password) && errors.password}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        fullWidth
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      {isSubmitting && <div id="submitting">Submitting</div>}

      <Button
        type="submit"
        variant="contained"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        data-testid=""
      >
        Create
      </Button>

    </Form>
  );
}

export function GenerateMnemonic(props: AppProps, state: AppState) {

  const [success, setSuccess] = React.useState(false)
  const [vaildate, setValidate] = React.useState(true)
  const history = useHistory();

  const onSubmit = async(values) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if(vaildate){
      chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.GEN_MNEMONIC })
      setSuccess(true)
      history.push("show-mnemonic")
    }
  }

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message,sender,sendResponse) => {
      });

  }, []);

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>
  if (!vaildate) successNode = <div className="success">Invalid xxxx</div>
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title='Generate Mnemonic' testId="" />
      {successNode}
      <Formik
        initialValues={{ mnemonic: "", password: "", confirmPassword: "" }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .min(6)
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
            .required("Required")
        })}
      >
        {genForm}
      </Formik>
    </div>
  )
}
