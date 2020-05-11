import * as React from 'react';
import Title from '../../Components/Title';
import PageNav from '../../Components/PageNav';
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
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
        <div className="mnemonic" data-testid="mnemonic-id">
          {/* <span className="">JSON/Keystore  </span> */}
          {mnemonic}
        </div>
        <br />
      </div>
    </div>
  );
}
