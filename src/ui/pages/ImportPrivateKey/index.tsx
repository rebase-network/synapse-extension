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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

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

let privateKeyOrKeystore = "privateKey";

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

  const [value, setValue] = React.useState("1");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isJSON, setIsJSON] = React.useState(true);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    if (value === "1") {
      setIsPrivate(true);
      setIsJSON(false);
      privateKeyOrKeystore = "keystore";
    } else {
      setIsPrivate(false);
      setIsJSON(true);
      privateKeyOrKeystore = "privateKey";
    }
  };

  const privateKeyFrom =
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
        data-testid="import-privateKey-submit"
      >
        Import
    </Button>
    </Form>

  const keystoreFrom =
    <Form className="form-keystore" id="form-keystore" onSubmit={handleSubmit}>
      <TextField
        label="keystore"
        name="keystore"
        multiline
        rows="4"
        fullWidth
        className={classes.textField}
        value={values.keystore}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.keystore}
        helperText={(errors.keystore && touched.keystore) && errors.keystore}
        margin="normal"
        variant="outlined"
        data-testid="field-keystore"
      />
      {/* <Popper id={'simple-popper'} open={true} >
            <div className={classesPopper.paper}>Invalid mnemonic</div>
          </Popper> */}
      <TextField
        label="keystore password"
        name="keystorePassword"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.keystorePassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.keystorePassword}
        helperText={(errors.keystorePassword && touched.keystorePassword) && errors.keystorePassword}
        margin="normal"
        variant="outlined"
        data-testid="field-keystore-password"
      />
      <TextField
        label="synapse password"
        name="synapsePassword"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.synapsePassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.synapsePassword}
        helperText={(errors.synapsePassword && touched.synapsePassword) && errors.synapsePassword}
        margin="normal"
        variant="outlined"
        data-testid="field-synapse-password"
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="import-keystore-submit-button"
        variant="contained"
        disabled={isSubmitting}
        color="primary"
        className={classes.button}
        data-testid="import-keystore-submit"
      >
        Import
      </Button>
    </Form>

  return (
    <FormControl component="fieldset" >
      <div className={classes.container}>
        <RadioGroup row value={value} onChange={handleRadioChange} >
          <FormControlLabel value="1" labelPlacement="bottom" control={<Radio />} label="PrivateKey" />
          <FormControlLabel value="2" labelPlacement="bottom" control={<Radio />} label="Keystore" />
        </RadioGroup>
        <div className="privateKey" data-testid="privateKey" hidden={isPrivate}>
          {privateKeyFrom}
        </div>
        <div className="json-keystore" data-testid="json-keystore" hidden={isJSON}>
          {/* <span className="">JSON/Keystore  </span> */}
          {keystoreFrom}
        </div>
      </div>
    </FormControl>
  );
}

export default function ImportPrivateKey(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false)
  const history = useHistory();
  const { network } = React.useContext(AppContext);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg.messageType === MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK || msg.messageType === MESSAGE_TYPE.IMPORT_KEYSTORE_OK) {
        history.push('/address')
      }
    })
  }, [])

  const onSubmit = async (values) => {
    if (privateKeyOrKeystore === "privateKey") {

      chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_PRIVATE_KEY })
      setSuccess(true)
    } else if (privateKeyOrKeystore === "keystore") {

      chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.IMPORT_KEYSTORE })
      setSuccess(true)
    }
  }

  let successNode = null
  if (success) successNode = <div className="success">Successfully</div>

  const classes = useStyles();
  return (
    <div className={classes.container}>
      {/* <Title title='Import PrivateKey' testId="" /> */}
      {successNode}
      <Formik
        initialValues={{ password: "", privatekey: "", keystore: "", keystorePassword: "", synapsePassword: "", }}

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
