import * as React from 'react';
import { Button, TextField } from '@material-ui/core';
import Title from '../../Components/Title'
import { makeStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../utils/constants'

const useStyles = makeStyles({
  container: {
    height: 600,
    width: 357,
    minHeight: 500,
    margin: 30,
    boxSizing: 'border-box'
  },
  button: {

  },
  textField: {

  }
});


interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState();
  const [balance, setBalance] = React.useState();

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.ADDRESS_INFO && message.address) {
        console.log('got address from bg: ', message.address)
        setAddress(message.address);
        setLoading(false);

        // get balance by address
      } else if (message.messageType === MESSAGE_TYPE.BALANCE_BY_ADDRESS) {
        console.log('get balance by address: ', message.balance)
        setBalance(message.balance);
        setLoading(false);
      } 
    })
    console.log('send request message');
    chrome.runtime.sendMessage({ messageType: MESSAGE_TYPE.REQUEST_ADDRESS_INFO })
    chrome.runtime.sendMessage({ messageType: MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS})
    setLoading(true);
  }, [])
  const loadingNode = loading ? <div>loading</div> : <div></div>
  // if (loading === true) {
  //   return <p>Loading ...</p>
  // }

  // const getBalance = ()=>{
  //   return 100;
  // }

  // const balance = getBalance()

  return (
    <div className={classes.container}>
      <Title title='Address' testId="address-title" />
      {loadingNode}
      <div className="address" data-testid="address-info">{address}</div>

      <div className="balance" data-testid="balance">{balance}<span className="">CKB</span></div>

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

        <Button
          id="send-button"
          color="primary"
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
