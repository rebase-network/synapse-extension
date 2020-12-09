import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import PageNav from '@ui/Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    marginTop: 16,
    textTransform: 'none',
  },
  textField: {},
  radioGroup: {
    'justify-content': 'center',
  },
  divShow: {
    'overflow-wrap': 'anywhere',
    'margin-top': '20px',
    border: '1px solid #eee',
    padding: '.8em',
    'font-size': '1.3em',
    background: '#fff',
  },
});

export default () => {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const intl = useIntl();

  const [privateKey, setPrivateKey] = React.useState('');
  const [keystore, setKeystore] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isJSON, setIsJSON] = React.useState(true);

  React.useEffect(() => {
    const listener = (request) => {
      if (request.type === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT) {
        setPrivateKey(request.privateKey);
        setKeystore(request.keystore);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    if (value === '1') {
      setIsPrivate(true);
      setIsJSON(false);
    } else {
      setIsPrivate(false);
      setIsJSON(true);
    }
  };

  const handleClick = () => {
    const url = `data:application/json;base64,${btoa(keystore)}`;
    browser.downloads.download({
      url,
      filename: 'keystore.json',
      saveAs: true,
    });
  };

  return (
    <div>
      <PageNav
        to="/export-private-key"
        title={<FormattedMessage id="Export Private Key / Keystore" />}
      />
      <div className={classes.container} data-testid="container">
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
            label={intl.formatMessage({ id: 'Keystore' })}
          />
        </RadioGroup>

        <div className={classes.divShow} data-testid="privateKey" hidden={isPrivate}>
          {privateKey}
        </div>
        <div data-testid="json-keystore" hidden={isJSON}>
          <div className={classes.divShow}>{keystore}</div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            className={classes.button}
          >
            <FormattedMessage id="Save Keystore" />
          </Button>
        </div>
        <br />
      </div>
    </div>
  );
};
