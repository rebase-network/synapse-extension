import * as React from 'react';
import Title from '../../Components/Title';
import PageNav from '../../Components/PageNav';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  mnemonic: {
    border: '1px solid #eee',
    padding: '.8em',
    'font-size': '1.3em',
    background: '#fff',
  },
});

interface AppProps {}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [mnemonic, setMnemonic] = React.useState([]);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('request ===>', request);
      if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT) {
        const mnemonic = request.mnemonic;
        setMnemonic(mnemonic);
      }
    });
  }, []);

  return (
    <div>
      <PageNav to="/export-mnemonic" title="Export Mnemonic" />
      <div className={classes.container}>
        <div className={classes.mnemonic} data-testid="mnemonic-id">
          {mnemonic}
        </div>
        <br />
      </div>
    </div>
  );
}
