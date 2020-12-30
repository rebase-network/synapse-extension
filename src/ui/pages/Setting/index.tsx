import React from 'react';
import { Formik, Form } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { FormattedMessage, useIntl } from 'react-intl';
import PageNav from '@ui/Components/PageNav';
import LanguageSelector from '@ui/Components/LanguageSelector';
import { TextField, Button, Modal } from '@material-ui/core';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

const useStyles = makeStyles({
  container: {
    margin: '0 20px 20px',
  },
  link: {
    textDecoration: 'none',
    fontSize: 16,
  },
  linkText: {
    color: '#333',
    padding: '1rem 0',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
  },
  deleteGroup: {
    borderTop: '1px solid #ccc',
    padding: '1rem 0',
    marginTop: '1rem',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '90%',
    height: '40%',
    padding: '10px',
    backgroundColor: 'white',
  },
});

const settingItems = [
  {
    link: '/export-mnemonic',
    text: <FormattedMessage id="Export Mnemonic" />,
    testId: 'exportMnemonic',
  },
  {
    link: '/export-private-key',
    text: <FormattedMessage id="Export Private Key / Keystore" />,
    testId: 'exportPrivateKey',
  },
  {
    link: '/import-private-key',
    text: <FormattedMessage id="Import Private Key / Keystore" />,
    testId: 'importPrivateKey',
  },
  {
    link: '/manage-contacts',
    text: <FormattedMessage id="Manage Contacts" />,
    testId: 'manageContacts',
  },
  {
    link: '/manage-udts',
    text: <FormattedMessage id="Manage UDTs" />,
    testId: 'ManageUDTs',
  },
  {
    link: '/manage-networks',
    text: <FormattedMessage id="Manage Networks" />,
    testId: 'ManageNetworks',
  },
];

const innerForm = (props: any) => {
  const intl = useIntl();

  const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

  return (
    <Form
      className="export-mnemonic-key"
      id="export-mnemonic-key"
      onSubmit={handleSubmit}
      aria-label="form"
    >
      <TextField
        size="small"
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

  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    const listener = (msg) => {
      if (msg.type === MESSAGE_TYPE.DELETE_WALLET_ERR) {
        setSuccess(false);
      }

      if (msg.type === MESSAGE_TYPE.DELETE_WALLET_OK) {
        history.push('./mnemonic-setting');
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values) => {
    browser.runtime.sendMessage({ ...values, type: MESSAGE_TYPE.DELETE_WALLET });
  };

  const isLogin = localStorage.getItem('IS_LOGIN') === 'YES';

  const settingElem = settingItems.map((item) => {
    return (
      <Link to={item.link} className={classes.link} key={item.link}>
        <div className={classes.linkText} data-testid={item.testId}>
          {item.text}
          <KeyboardArrowRightIcon />
        </div>
      </Link>
    );
  });

  let errMsgNode = null;
  if (!success) {
    const errMsgI18n = intl.formatMessage({
      id: 'Incorrect Password',
    });
    errMsgNode = <div className="failure">{errMsgI18n}</div>;
  }

  return (
    <div>
      <PageNav to="/" title={intl.formatMessage({ id: 'Setting' })} />
      <div className={classes.container}>
        {isLogin ? settingElem : ''}

        <LanguageSelector />

        {isLogin ? (
          <div className={classes.deleteGroup}>
            <Button color="secondary" variant="contained" onClick={handleOpen}>
              <FormattedMessage id="Delete Wallet" />
            </Button>

            <Modal open={open} onClose={handleClose} className={classes.modal}>
              <div className={classes.paper}>
                {errMsgNode}

                <h2>
                  <FormattedMessage id="Are your sure Delete Wallet" />
                  <span>?</span>
                </h2>
                <span>
                  <FormattedMessage id="Please backup your wallet, or wallet can't recover" />
                </span>
                <Formik initialValues={{ password: '' }} onSubmit={onSubmit}>
                  {innerForm}
                </Formik>
              </div>
            </Modal>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
