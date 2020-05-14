import * as React from 'react';
// import './Popup.scss';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';

const useStylesPopper = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: '1px solid',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
});

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
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
    handleReset,
  } = props;

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label="Mnemonic | Only Support 12 Words"
        name="mnemonic"
        multiline
        rows="4"
        fullWidth
        className={classes.textField}
        value={values.mnemonic}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.mnemonic}
        helperText={errors.mnemonic && touched.mnemonic && errors.mnemonic}
        margin="normal"
        variant="outlined"
        data-testid="field-mnemonic"
      />
      {/* <Popper id={'simple-popper'} open={true} >
        <div className={classesPopper.paper}>Invalid mnemonic</div>
      </Popper> */}
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
        data-testid="field-password"
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid="field-confirm-password"
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="submit-button"
        variant="contained"
        disabled={isSubmitting}
        color="primary"
        className={classes.button}
        data-testid="submit-button"
      >
        Import
      </Button>
    </Form>
  );
};

export default function ImportMnemonic(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false);
  const [vaildate, setValidate] = React.useState(true);
  const history = useHistory();

  const onSubmit = async (values) => {
    chrome.runtime.sendMessage({
      ...values,
      messageType: MESSAGE_TYPE.IMPORT_MNEMONIC,
    });
    console.log(values);
    if (vaildate) {
      setSuccess(true);
      // go to address page
    }
    localStorage.setItem('IS_MNEMONIC_IMPORTED', 'YES');
  };

  React.useEffect(() => {
    console.time('***** import mnemonic');
    console.time('-------import mnemonic: useEffect');
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg === MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC) {
        console.log('index.tsx => message', msg);
        setValidate(false); //false验证未通过
        return;
      } else if (msg === MESSAGE_TYPE.VALIDATE_PASS) {
        console.timeEnd('***** import mnemonic');
        setValidate(true);
        history.push('/address');
      }
    });
    console.timeEnd('-------import mnemonic: useEffect');
  }, []);

  let successNode = null;
  if (success) successNode = <div className="success">Successfully</div>;
  if (!vaildate) successNode = <div className="success">Invalid mnemonic</div>;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title="Import Mnemonic" testId="mnemonic-form-title" />
      {successNode}
      <Formik
        initialValues={{ mnemonic: '', password: '', confirmPassword: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string().required('Required'),
          password: Yup.string().min(6).required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
            .required('Required'),
        })}
      >
        {innerForm}
      </Formik>
    </div>
  );
}
