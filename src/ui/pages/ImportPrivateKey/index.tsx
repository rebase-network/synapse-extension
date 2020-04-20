import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
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
        label="PrivateKey"
        name="privatekey"
        type="text"
        placeholder="私钥"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">0x</InputAdornment>,
        }}
        className={classes.textField}
        value={values.privatekey}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        // helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="原密码"
        fullWidth
        className={classes.textField}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        // helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid=""
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        color="primary"
        className={classes.button}
        data-testid=""
      >
        Import
      </Button>

    </Form>
  );
}

export default function ImportPrivateKey(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const history = useHistory();
  const { network } = React.useContext(AppContext);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      console.log("msg ===>",msg);
      if (msg.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK) {
        history.push('/address')
      }
    })
  }, [])


  const onSubmit = async (values) => {

    await new Promise(resolve => setTimeout(resolve, 500));
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY })
    setSuccess(true)
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Import PrivateKey' testId="" />
      {successNode}
      <Formik
        initialValues={{ password: "", privatekey: "", }}

        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .required("Required").min(6),
          privatekey: Yup.string()
            .required("Required").length(64).matches(/[0-9a-fA-F]+/),
        })}
      >
        {innerForm}
      </Formik>
    </div>
  )
}
