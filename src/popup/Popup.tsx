import * as React from 'react';
// import './Popup.scss';
import Input from '../Components/Input'
import Title from '../Components/Title'
import Textarea from '../Components/Textarea'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles({
  container: {
    height: 600,
    width: 357,
    minHeight: 500,
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
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
        className={classes.textField}
        value={values.mnemonic}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={(errors.mnemonic && touched.mnemonic) && errors.mnemonic}
        margin="normal"
        data-test="mnemonic"
      />
      <TextField
        label="Password"
        name="password"
        className={classes.textField}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={(errors.password && touched.password) && errors.password}
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        className={classes.textField}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
        margin="normal"
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button type="submit" disabled={isSubmitting}>
        Import
      </Button>

    </Form>
  );
}

export default function (props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const [value, setValue] = React.useState('Controlled');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    console.log(event.target.value, '======')
  };

  function onSubmit(e) {
    e.preventDefault()
    setSuccess(true)
    // chrome.runtime.sendMessage('abc')
    console.log(e, '---=====')
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      {successNode}
      <Title title='Import Mnemonic' />

      <Formik
        initialValues={{ mnemonic: "", password: "", confirmPassword: "" }}
        onSubmit={async values => {
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log(JSON.stringify(values, null, 2));
          setSuccess(true)
        }}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string()
            .required("Required"),
          password: Yup.string()
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
