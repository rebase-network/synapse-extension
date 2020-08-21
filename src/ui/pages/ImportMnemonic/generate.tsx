import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { MESSAGE_TYPE } from '@utils/constants';
import Title from '@ui/Components/Title';
import { getChallenge, getAssertion } from '@src/authn/authn';

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
      {/* <TextField
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
      /> */}

      <TextField
        label="name"
        name="name"
        type="name"
        fullWidth
        className={classes.textField}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.name}
        helperText={errors.name && touched.name && errors.name}
        margin="normal"
        variant="outlined"
        data-testid="field-confirm-name"
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
        Authenticate
      </Button>
    </Form>
  );
};

export default function GenerateMnemonic(props: AppProps, state: AppState) {
  const history = useHistory();
  const intl = useIntl();
  const classes = useStyles();

  const onSubmit = async (values) => {
    const userName = values.name;
    await getChallenge().then((challenge) => {
      return getAssertion(challenge, userName);
    });
    localStorage.setItem('IS_LOGIN', 'YES');
    history.push('/address');
  };

  //   React.useEffect(() => {
  //     chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  //       if (msg.type === MESSAGE_TYPE.RECE_MNEMONIC && msg.mnemonic) {
  //         setMnemonic(msg.mnemonic);
  //       } else if (msg === MESSAGE_TYPE.VALIDATE_PASS) {
  //         setValidate(true);
  //         localStorage.setItem('IS_LOGIN', 'YES');
  //         history.push('/address');
  //       }
  //     });
  //   });
  //   let successNode = null;
  //   if (success) successNode = <div className="success">Successfully</div>;
  //   if (!vaildate) successNode = <div className="success">Invalid</div>;

  return (
    <div className={classes.container}>
      <Title title={intl.formatMessage({ id: 'Generate Mnemonic' })} testId="" />
      <Formik
        enableReinitialize
        initialValues={{ name: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required('Required'),
        })}
      >
        {genForm}
      </Formik>
    </div>
  );
}
