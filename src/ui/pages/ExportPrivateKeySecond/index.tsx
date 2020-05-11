import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';
import PageNav from '../../Components/PageNav';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
  radioGroup: {
    'justify-content': 'center',
  },
  divShow:{
    'overflow-wrap': 'anywhere',
    'margin-top': '20px',
  },
});

interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const [privateKey, setPrivateKey] = React.useState('');
  const [keystore, setKeystore] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isJSON, setIsJSON] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT) {
        const privateKey = request.privateKey;
        const keystore = request.keystore;
        setPrivateKey(privateKey);
        setKeystore(keystore);
      }
    });
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

  return (
    <div>
      <PageNav to="/export-private-key" title="Export Private Key" />
      <div className={classes.container}>
        <RadioGroup row value={value} onChange={handleRadioChange} className={classes.radioGroup}>
          <FormControlLabel
            value="1"
            labelPlacement="bottom"
            control={<Radio />}
            label="PrivateKey"
          />
          <FormControlLabel
            value="2"
            labelPlacement="bottom"
            control={<Radio />}
            label="Keystore"
          />
        </RadioGroup>
        <div className={classes.divShow} data-testid="privateKey" hidden={isPrivate} >
          {privateKey}
        </div>
        <div className={classes.divShow} data-testid="json-keystore" hidden={isJSON}>
          {keystore}
        </div>
        <br />
      </div>
    </div>
  );
}
