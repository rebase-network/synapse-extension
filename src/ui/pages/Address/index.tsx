import * as React from 'react';
import { Button, Dialog, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { shannonToCKBFormatter } from '../../../utils/formatters';
import Title from '../../Components/Title';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { AppContext } from '../../App';

const QrCode = require('qrcode.react');

const useStyles = makeStyles({
  container: {
    margin: 30
  },
  button: {},
  dialogTitle: {
    textAlign: 'right'
  },
  dialogContent: {
    padding: '0 16px 24px',
    textAlign: 'center',
    minWidth: 200
  },
  address: {
    marginTop: 16,
    fontSize: 8
  },
  loading: {
    width: 200,
    padding: 24,
    textAlign: 'center'
  },
  tip: {
    marginBottom: 24,
    color: 'green'
  }
});

interface AppProps {}

interface AppState {}

export default function(props: AppProps, state: AppState) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [tooltip, setTooltip] = React.useState('');
  const { network } = React.useContext(AppContext);
  const history = useHistory();

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((
      message,
      sender,
      sendResponse
    ) =>{
      if (message.messageType === MESSAGE_TYPE.ADDRESS_INFO) {
        if (message.address) {
          setAddress(message.address);
        } else {
          history.push('./import-mnemonic');
        }
        // get balance by address
      } else if (message.messageType === MESSAGE_TYPE.BALANCE_BY_ADDRESS) {
        setBalance(message.balance/10**8);
        setLoading(false);
      }
    });

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_ADDRESS_INFO
    });

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS,
      network
    });
    setLoading(true);
  }, []);

  const onSendtx = () => {
    history.push('/send-tx');
  };

  React.useEffect(() => {
    (async function copyAddress() {
      if (open && address ) {
        await navigator.clipboard.writeText(address);
        setTooltip('Address has been copied to clipboard');
      }
    })();
  }, [open, address]);

  const balanceNode = loading ? (
    <div>loading</div>
  ) : (
    <div className="balance" data-testid="balance">
      {balance}
      <span className="">CKB</span>
    </div>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTooltip('');
  };

  return (
    <div className={classes.container}>
      <Title title="Address" testId="address-title" />
      <div className="address" data-testid="address-info">
        {address}
      </div>
      {balanceNode}
      <div className="">
        <Button
          type="button"
          id="receive-button"
          color="primary"
          variant="contained"
          className={classes.button}
          data-testid="receive"
          onClick={handleClickOpen}
        >
          Receive
        </Button>

        <br />
        <br />

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
      <Dialog open={open}>
        <div className={classes.dialogTitle}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.dialogContent}>
          <div className={classes.tip}>{tooltip}</div>
          {address[network] ? (
            <QrCode value={address[network]} size={200} />
          ) : (
            <div>loading</div>
          )}
          <div className={classes.address}>{address[network]}</div>
        </div>
      </Dialog>
    </div>
  );
}
