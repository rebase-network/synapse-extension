import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import Title from '@ui/Components/Title';
import { MESSAGE_TYPE } from '@utils/constants';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
});

interface AppProps {}

interface AppState {}

export const innerForm = (props: any) => {
  const classes = useStyles();
  const intl = useIntl();

  const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage({ id: 'Mnemonic(Only Support 12 Words)' })}
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
      <TextField
        label={intl.formatMessage({ id: 'Password (min 6 chars)' })}
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
        label={intl.formatMessage({ id: 'Confirm Password' })}
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
        <FormattedMessage id="Import" />
      </Button>
    </Form>
  );
};

export default function ImportMnemonic(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false);
  const [vaildate, setValidate] = React.useState(true);
  const history = useHistory();
  const intl = useIntl();

  const onSubmit = async (values) => {
    chrome.runtime.sendMessage({
      ...values,
      type: MESSAGE_TYPE.IMPORT_MNEMONIC,
    });
    if (vaildate) {
      setSuccess(true);
    }

    localStorage.setItem('IS_LOGIN', 'YES');
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg === MESSAGE_TYPE.IS_INVALID_MNEMONIC) {
        setValidate(false);
      } else if (msg === MESSAGE_TYPE.VALIDATE_PASS) {
        setValidate(true);
        history.push('/address');
      }
    });
  }, []);

  let successNode = null;
  if (success) successNode = <div className="success">Successfully</div>;
  if (!vaildate) successNode = <div className="success">Invalid mnemonic</div>;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title={intl.formatMessage({ id: 'Import Mnemonic' })} testId="mnemonic-form-title" />
      {successNode}
      <Formik
        initialValues={{ mnemonic: '', password: '', confirmPassword: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          password: Yup.string()
            .min(6)
            .required(intl.formatMessage({ id: 'Required' })),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], intl.formatMessage({ id: "Passwords don't match!" }))
            .required(intl.formatMessage({ id: 'Required' })),
        })}
      >
        {innerForm}
      </Formik>
    </div>
  );
}
