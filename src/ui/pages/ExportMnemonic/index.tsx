import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '@utils/constants';
import PageNav from '@ui/Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
    fontSize: 12,
  },
});

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
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
    handleReset,
  } = props;

  return (
    <Form
      className="export-mnemonic-key"
      id="export-mnemonic-key"
      onSubmit={handleSubmit}
      aria-label="form"
    >
      <TextField
        label={intl.formatMessage({ id: 'Password' })}
        name="password"
        type="password"
        id="password"
        fullWidth
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-password"
      />

      {isSubmitting && (
        <div id="submitting">
          <FormattedMessage id="Submitting" />
        </div>
      )}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        data-testid="submit-button"
      >
        <FormattedMessage id="Confirm" />
      </Button>
    </Form>
  );
};

export default function (props: AppProps, state: AppState) {
  const history = useHistory();
  const classes = useStyles();
  const intl = useIntl();
  const [vaildate, setVaildate] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onSubmit = async (values) => {
    // background.ts check the password
    chrome.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK });
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function listenerProcessing(
      message,
      sender,
      sendResponse,
    ) {
      if (message.type === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT) {
        if (message.isValidatePassword && message.isValidateEntropy) {
          history.push('/export-mnemonic-second');
          chrome.runtime.sendMessage({
            message,
            type: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND,
          });
        } else if (!message.isValidateEntropy) {
          setVaildate(false);
          const errorMessagei18n = intl.formatMessage({
            id: 'invalidated mnemonic',
          });
          setErrorMessage(errorMessagei18n);
        } else if (!message.isValidatePassword) {
          setVaildate(false);
          const errorMessagei18n = intl.formatMessage({
            id: 'invalidated password',
          });
          setErrorMessage(errorMessagei18n);
        }
      }
    });
  }, []);

  let failureNode = null;
  if (!vaildate) {
    failureNode = <div className="failure">{errorMessage}</div>;
  }
  return (
    <div>
      <PageNav to="/setting" title={<FormattedMessage id="Export Mnemonic" />} />
      <div className={classes.container}>
        {failureNode}
        <Formik
          initialValues={{ password: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .min(6)
              .required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
