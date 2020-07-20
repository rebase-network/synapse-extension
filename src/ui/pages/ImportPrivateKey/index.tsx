import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { AppContext } from '@ui/utils/context';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { FormattedMessage, useIntl } from 'react-intl';
import PageNav from '@ui/Components/PageNav';
import { MESSAGE_TYPE } from '@utils/constants';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
  radioGroup: {
    'justify-content': 'center',
  },
});

interface AppProps {}

interface AppState {}

export default function ImportPrivateKey(props: AppProps, state: AppState) {
  const { network } = React.useContext(AppContext);
  const history = useHistory();
  const [isHidePrivate, setIsHidePrivate] = React.useState(false);
  const [value, setValue] = React.useState('1');
  const [showMsg, setShowMsg] = React.useState(null);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (
        msg.type === MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK ||
        msg.type === MESSAGE_TYPE.IMPORT_KEYSTORE_OK
      ) {
        history.push('/address');
      } else if (
        msg.type === MESSAGE_TYPE.IMPORT_PRIVATE_KEY_ERR ||
        msg.type === MESSAGE_TYPE.IMPORT_KEYSTORE_ERR
      ) {
        setShowMsg(msg.message);
      }
    });
  }, [history, showMsg]);

  const onSubmit = async (values) => {
    if (!isHidePrivate) {
      chrome.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY });
    } else {
      chrome.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.IMPORT_KEYSTORE });
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    if (value === '1') {
      setIsHidePrivate(true);
    } else {
      setIsHidePrivate(false);
    }
  };

  const classes = useStyles();
  const intl = useIntl();

  const innerForm = (props) => {
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

    const privateKeyForm = (
      <Form className="form-privateKey" id="form-privateKey" onSubmit={handleSubmit}>
        <TextField
          label={intl.formatMessage({ id: 'Private Key' })}
          name="privateKey"
          type="password"
          placeholder={intl.formatMessage({ id: 'Private Key' })}
          fullWidth
          className={classes.textField}
          value={values.privateKey}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.privateKey}
          margin="normal"
          variant="outlined"
          data-testid="testid-form-privateKey"
        />
        <TextField
          label={intl.formatMessage({ id: 'Password' })}
          name="password"
          type="password"
          placeholder={intl.formatMessage({ id: 'Wallet Password' })}
          fullWidth
          className={classes.textField}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.password}
          margin="normal"
          variant="outlined"
          data-testid="testid-form-password"
        />
        {isSubmitting && <div id="submitting">Submitting</div>}
        <Button
          id="privateKey-form-button"
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          color="primary"
          className={classes.button}
          data-testid="import-privateKey-submit"
        >
          <FormattedMessage id="Import" />
        </Button>
      </Form>
    );

    const keystoreForm = (
      <Form className="form-keystore" id="form-keystore" onSubmit={handleSubmit}>
        <TextField
          label={intl.formatMessage({ id: 'Keystore' })}
          name="keystore"
          multiline
          rows="4"
          fullWidth
          className={classes.textField}
          value={values.keystore}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.keystore}
          helperText={errors.keystore && touched.keystore && errors.keystore}
          margin="normal"
          variant="outlined"
          data-testid="field-keystore"
        />
        <TextField
          label={intl.formatMessage({ id: 'Keystore Password' })}
          name="keystorePassword"
          type="password"
          fullWidth
          className={classes.textField}
          value={values.keystorePassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.keystorePassword}
          helperText={
            errors.keystorePassword && touched.keystorePassword && errors.keystorePassword
          }
          margin="normal"
          variant="outlined"
          data-testid="field-keystore-password"
        />
        <TextField
          label={intl.formatMessage({ id: 'Wallet Password' })}
          name="userPassword"
          type="password"
          fullWidth
          className={classes.textField}
          value={values.userPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.userPassword}
          helperText={errors.userPassword && touched.userPassword && errors.userPassword}
          margin="normal"
          variant="outlined"
          data-testid="field-synapse-password"
        />
        {isSubmitting && <div id="submitting">Submitting</div>}
        <Button
          type="submit"
          id="import-keystore-submit-button"
          variant="contained"
          disabled={isSubmitting}
          color="primary"
          className={classes.button}
          data-testid="import-keystore-submit"
        >
          <FormattedMessage id="Import" />
        </Button>
      </Form>
    );

    return (
      <FormControl component="fieldset">
        <div>
          <div className="privateKey" data-testid="privateKey" hidden={isHidePrivate}>
            {privateKeyForm}
          </div>
          <div className="json-keystore" data-testid="json-keystore" hidden={!isHidePrivate}>
            {keystoreForm}
          </div>
        </div>
      </FormControl>
    );
  };

  type validateObjType = {
    password?: Yup.StringSchema<string>;
    privateKey?: Yup.StringSchema<string>;
    keystore?: Yup.StringSchema<string>;
    keystorePassword?: Yup.StringSchema<string>;
    userPassword?: Yup.StringSchema<string>;
  };

  const validateObj: validateObjType = !isHidePrivate
    ? {
        password: Yup.string()
          .required(intl.formatMessage({ id: 'Required' }))
          .min(6),
        privateKey: Yup.string().required(intl.formatMessage({ id: 'Required' })), // TODO
      }
    : {
        keystore: Yup.string().required(intl.formatMessage({ id: 'Required' })),
        keystorePassword: Yup.string()
          .required(intl.formatMessage({ id: 'Required' }))
          .min(6),
        userPassword: Yup.string()
          .required(intl.formatMessage({ id: 'Required' }))
          .min(6),
      };

  return (
    <div>
      <PageNav to="/setting" title={<FormattedMessage id="Import Private Key / Keystore" />} />
      <div className={classes.container}>
        {showMsg ? intl.formatMessage({ id: showMsg }) : null}
        <RadioGroup row value={value} onChange={handleRadioChange} className={classes.radioGroup}>
          <FormControlLabel
            value="1"
            labelPlacement="bottom"
            control={<Radio />}
            label={intl.formatMessage({ id: 'Private Key' })}
          />
          <FormControlLabel
            value="2"
            labelPlacement="bottom"
            control={<Radio />}
            label="Keystore"
          />
        </RadioGroup>

        <Formik
          initialValues={{
            password: '',
            privateKey: '',
            keystore: '',
            keystorePassword: '',
            userPassword: '',
          }}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape(validateObj)}
        >
          {innerForm}
        </Formik>
      </div>
    </div>
  );
}
