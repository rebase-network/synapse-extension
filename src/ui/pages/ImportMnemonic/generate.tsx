import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { MESSAGE_TYPE } from '@utils/constants';
import Title from '@ui/Components/Title';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  container: {
    margin: 30,
  },
}));

interface AppProps {}

interface AppState {}

export const genForm = (props) => {
  const classes = useStyles();
  const intl = useIntl();

  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    enableReinitialize,
    handleReset,
  } = props;

  return (
    <Form className="gen-mnemonic" id="gen-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage({ id: 'Mnemonic(Only Support 12 Words)' })}
        name="mnemonic"
        multiline
        rows="4"
        fullWidth
        value={values.mnemonic}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.mnemonic}
        helperText={errors.mnemonic && touched.mnemonic && errors.mnemonic}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label={intl.formatMessage({ id: 'Password (min 6 chars)' })}
        name="password"
        type="password"
        fullWidth
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label={intl.formatMessage({ id: 'Confirm Password' })}
        name="confirmPassword"
        type="password"
        fullWidth
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
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
        <FormattedMessage id="Create" />
      </Button>
    </Form>
  );
};

export default function GenerateMnemonic(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false);
  const [vaildate, setValidate] = React.useState(true);
  const [mnemonic, setMnemonic] = React.useState('');

  const history = useHistory();
  const intl = useIntl();

  const onSubmit = async (values) => {
    if (vaildate) {
      setSuccess(true);
      chrome.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.SAVE_MNEMONIC });
    }
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg.type === MESSAGE_TYPE.RECE_MNEMONIC && msg.mnemonic) {
        setMnemonic(msg.mnemonic);
      } else if (msg === MESSAGE_TYPE.VALIDATE_PASS) {
        setValidate(true);
        localStorage.setItem('IS_LOGIN', 'YES');
        history.push('/address');
      }
    });
  });

  let successNode = null;
  if (success) successNode = <div className="success">Successfully</div>;
  if (!vaildate) successNode = <div className="success">Invalid</div>;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title={intl.formatMessage({ id: 'Generate Mnemonic' })} testId="" />
      {successNode}
      <Formik
        enableReinitialize
        initialValues={{ mnemonic, password: '', confirmPassword: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string().trim().required('Required'),
          password: Yup.string().trim().min(6).required('Required'),
          confirmPassword: Yup.string()
            .trim()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
            .required('Required'),
        })}
      >
        {genForm}
      </Formik>
    </div>
  );
}
