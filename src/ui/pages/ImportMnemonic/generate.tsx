import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import Title from '@ui/Components/Title';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
});

const genForm = (props: any) => {
  const intl = useIntl();

  const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form className="gen-mnemonic" id="gen-mnemonic" onSubmit={handleSubmit} aria-label="form">
      <TextField
        label={intl.formatMessage({ id: 'Mnemonic(Only Support 12 Words)' })}
        id="mnemonic"
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
        id="password"
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
        id="confirmPassword"
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

export default () => {
  const [success, setSuccess] = React.useState(false);
  const [vaildate, setValidate] = React.useState(true);
  const [mnemonic, setMnemonic] = React.useState('');

  const history = useHistory();
  const intl = useIntl();

  const onSubmit = async (values) => {
    if (vaildate) {
      setSuccess(true);
      browser.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.SAVE_MNEMONIC });
    }
  };

  React.useEffect(() => {
    const listener = (msg) => {
      if (msg.type === MESSAGE_TYPE.RECE_MNEMONIC && msg.mnemonic) {
        setMnemonic(msg.mnemonic);
      } else if (msg === MESSAGE_TYPE.VALIDATE_PASS) {
        setValidate(true);
        localStorage.setItem('IS_LOGIN', 'YES');
        history.push('/address');
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
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
};
