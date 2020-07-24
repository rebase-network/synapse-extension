import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import PageNav from '@ui/Components/PageNav';
import RawTxDetail from '@ui/Components/PrettyPrintJson/Accordion';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
});

interface AppProps {}

interface AppState {}

export const innerForm = (props: any) => {
  const intl = useIntl();

  const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

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

export default () => {
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(location.search);
  const data = searchParams?.data ? JSON.parse(searchParams?.data as string) : '';
  const onSubmit = async (values) => {
    const requestMsg = { ...values };
    if (searchParams?.data && searchParams?.type) {
      requestMsg.data = data;
      requestMsg.type = searchParams.type;
      browser.runtime.sendMessage(requestMsg);
    }
  };

  return (
    <div>
      <PageNav to="/setting" title={<FormattedMessage id="Auth" />} />
      <RawTxDetail tx={data?.tx} />
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
};
