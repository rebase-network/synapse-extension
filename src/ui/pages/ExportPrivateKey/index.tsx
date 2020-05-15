import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';
import PageNav from '../../Components/PageNav';

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

  return (
    <Form className="export-private-key" id="export-private-key" onSubmit={handleSubmit}>
      <TextField
        label="Password"
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

      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        data-testid="submit-button"
      >
        Confirm
      </Button>
    </Form>
  );
};

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = async (values) => {
    //background.ts check the password
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK });
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (
        message.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT &&
        message.isValidatePassword
      ) {
        history.push('/export-private-key-second'); //测试成功的地址
        chrome.runtime.sendMessage({
          message,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND,
        });
      }
    });
  }, []);

  return (
    <div>
      <PageNav to="/setting" title="Export Private Key / Keystore" />
      <div className={classes.container}>
        <Formik
          initialValues={{ password: '' }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            password: Yup.string().min(6).required('Required'),
          })}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
