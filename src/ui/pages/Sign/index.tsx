import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '@utils/constants';
import PageNav from '@ui/Components/PageNav';
import * as browser from 'webextension-polyfill';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
});

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
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
    <Form className="password" id="password-field" onSubmit={handleSubmit} aria-label="form">
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
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(location.search);

  const onSubmit = async (values) => {
    const requestMsg = { ...values, type: MESSAGE_TYPE.SIGN_TX };
    if (searchParams?.tx) {
      requestMsg.tx = JSON.parse(searchParams.tx as string);
      browser.runtime.sendMessage(requestMsg);
    }
  };

  return (
    <div>
      <PageNav to="/setting" title={<FormattedMessage id="Sign TX" />} />
      <div className={classes.container}>
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
