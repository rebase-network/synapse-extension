import * as React from 'react';
import { shannonToCKBFormatter } from '../../../utils/formatters'
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Title from '../../Components/Title'
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants'
import { AppContext } from '../../App'

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {}
});


interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState({});
  const [balance, setBalance] = React.useState('0');
  const { network } = React.useContext(AppContext)
  const history = useHistory();

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.ADDRESS_INFO) {
        console.log('message: ', message);

        if (message.address) {
          setAddress(message.address);
        } else {
          history.push('./import-mnemonic')
        }
      // get balance by address
      } else if (message.messageType === MESSAGE_TYPE.BALANCE_BY_ADDRESS) {
        setBalance(message.balance);
        setLoading(false);
      }
    })
    chrome.runtime.sendMessage({ messageType: MESSAGE_TYPE.REQUEST_ADDRESS_INFO })
    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS,
      network
    })
    setLoading(true);
  }, [])
  const balanceNode = loading ? <div data-testid="balance">loading</div> : <div className="balance" data-testid="balance">{balance}<span className="">CKB</span></div>

  const onSendtx = () => {
    history.push('/send-tx')
  }

  return (
    <div className={classes.container}>
      <Title title='Address' testId="address-title" />
      <div className="address" data-testid="address-info">{address[network]}</div>
      {balanceNode}

      <div className="">
        <Button
          type="button"
          id="receive-button"
          color="primary"
          variant="contained"
          className={classes.button}
          data-testid="receive"
        >
          Receive
        </Button>

        <br/>
        <br/>

        <Button
          id="send-button"
          color="primary"
          onClick={onSendtx}
          variant="contained"
          className={classes.button}
          data-testid="send"
        >
          Send
        </Button>

      </div>
    </div>
  )
}
