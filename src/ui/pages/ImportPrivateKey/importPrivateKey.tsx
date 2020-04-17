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
        label="PrivateKey"
        name="privatekey"
        type="text"
        placeholder="私钥"
        fullWidth
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

export default function ImportPrivateKey (props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const history = useHistory();
  const { network } = React.useContext(AppContext);
  const [valAddress, setValAddress] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener( (msg, sender, sendResp) => {
      // if (msg.messageType === MESSAGE_TYPE.TO_TX_DETAIL) {
      //   console.log("TO_TX_DETAIL msg", JSON.stringify(msg));
      //   history.push('/tx-detail')
      // }

    })
    // setLoading(true);
  }, [])

  const onSubmit = async(values) => {

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("onSubmit=>",values);
    console.log("network =>", network);

    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY })

    // 消息发送到Background.ts
    // network - TODO
    // chrome.runtime.sendMessage({ ...values, network, messageType: MESSAGE_TYPE.RESQUEST_SEND_TX })
    setSuccess(true)

  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>
  let validateNode = null
  if (!valAddress) validateNode = <div className="success">Invalid Address</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Import PrivateKey' testId="" />
      {successNode}
      {validateNode}
      <Formik
        initialValues={{ password: "", privatekey: "",}}

        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          password: Yup.string()
          .required("Required").min(6),
          privatekey: Yup.string()
          .required("Required").length(66).matches(/^0x/),
        })}
      >
        {innerForm}
      </Formik>
    </div>
  )
}
