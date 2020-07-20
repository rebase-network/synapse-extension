import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '@utils/constants';
import PageNav from '@ui/Components/PageNav';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: 30,
    },
  }),
);

interface AppProps {}

interface AppState {}

export const innerForm = (props) => {
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
  const intl = useIntl();

  return (
    <Form className="export-private-key" id="export-private-key" onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage({ id: 'Password' })}
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
        data-testid="field-password"
      />

      {isSubmitting && <div id="submitting">{intl.formatMessage({ id: 'Submitting' })}</div>}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        data-testid="submit-button"
      >
        {intl.formatMessage({ id: 'Confirm' })}
      </Button>
    </Form>
  );
};

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const history = useHistory();
  const intl = useIntl();
  const [showMsg, setShowMsg] = React.useState(
    'It may take 1 minute for the generation of keystore',
  );

  const onSubmit = async (values) => {
    // background.ts check the password
    chrome.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK });
  };

  //   setShowMsg(intl.formatMessage({ id: 'It may take 1 minute for the generation of keystore' }));

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (
        message.type === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT &&
        message.isValidatePassword
      ) {
        history.push('/export-private-key-second'); // 测试成功的地址
        chrome.runtime.sendMessage({
          message,
          type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND,
        });
      }
      if (
        message.type === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT &&
        !message.isValidatePassword
      ) {
        setShowMsg('INVALID_PASSWORD');
      }
    });
  }, [history, showMsg]);

  return (
    <div>
      <PageNav to="/setting" title={<FormattedMessage id="Export Private Key / Keystore" />} />
      <div className={classes.container}>
        <div>{intl.formatMessage({ id: showMsg })}</div>
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
