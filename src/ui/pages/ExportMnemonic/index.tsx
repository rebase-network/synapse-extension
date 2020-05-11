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
import PageNav from '../../Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
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
    <Form className="export-mnemonic-key" id="export-mnemonic-key" onSubmit={handleSubmit}>
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
        data-testid="submit-button"
      >
        Confirm
      </Button>
    </Form>
  );
};

export default function (props: AppProps, state: AppState) {
  const history = useHistory();
  const classes = useStyles();

  const onSubmit = async (values) => {
    //background.ts check the password
    chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK });
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT) {
        if (message.isValidatePassword) {
          history.push('/export-mnemonic-second'); //测试成功的地址
          chrome.runtime.sendMessage({
            message,
            messageType: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND,
          });
        }
      }
    });
  }, []);

  return (
    <div>
      <PageNav to="/setting" title="Export Mnemonic" />
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
