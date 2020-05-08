import * as React from 'react';
import {Grid, ListItem, ListItemText, List, Button, Dialog, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import {
  createMuiTheme,
  createStyles,
  withStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
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

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.primary,
      fontSize: 18,
      border: 0,
    },
  }),
);

const BootstrapButton = withStyles({
  root: {
    width: "88px",
    size: 'medium',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '8px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);

const useStylesButton = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const classesTheme = useStylesTheme();
  const classesButton = useStylesButton();

  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState("");
  const [addressShort, setAddressShort] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [tooltip, setTooltip] = React.useState('');
  const [txs, setTxs] = React.useState([]);
  const { network } = React.useContext(AppContext);
  const history = useHistory();

  function generate(element) {
    return txs.map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((
      msg,
      sender,
      sendResponse
    ) => {
      if (msg.messageType === MESSAGE_TYPE.ADDRESS_INFO) {
        if (msg.address) {
          setAddress(msg.address);
          const address = msg.address;
          const addressShort = address.substr(0,10) +"..." + address.substr(address.length-10,address.length);
          setAddressShort(addressShort);
        } else {
          history.push('./import-mnemonic');
        }
        // get balance by address
      } else if (msg.messageType === MESSAGE_TYPE.BALANCE_BY_ADDRESS) {
        setBalance(msg.balance / 10 ** 8);
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

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.GET_TX_HISTORY
    });

    chrome.runtime.onMessage.addListener((
      msg,
      sender,
      sendResponse
    ) => {
      if (msg.messageType === MESSAGE_TYPE.SEND_TX_HISTORY) {
        const txs = msg.txs
        if (txs) {
          setTxs(txs)
        }
    }});

  }, []);

  const onSendtx = () => {
    history.push('/send-tx');
  };

  React.useEffect(() => {
    (async function copyAddress() {
      if (open && address) {
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
      <div className="classesTheme.root">
        <Grid container spacing={2}>
            <Grid item xs={12} alignContent="center" alignItems="center">
              {/* <Paper className={classesTheme.paper}>Address</Paper> */}
              <Box textAlign="center" fontSize={22}>
                  Address
              </Box>
            </Grid>
            <Grid item xs={12}>
              {/* <Paper className={classesTheme.paper}>{addressShort}</Paper> */}
              <Box textAlign="center" fontSize={22}>
                {addressShort}
              </Box>
            </Grid>
        </Grid>
        <br/>
        <Divider variant="middle" />
        <br/>
        <br/>
        <br/>
        <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* <Paper className={classesTheme.paper}>{balanceNode}</Paper> */}
              <Box textAlign="center" fontSize={22}>
                {balanceNode}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} alignItems="center" alignContent="center">
              <BootstrapButton
                  type="button"
                  id="receive-button"
                  color="primary"
                  variant="contained"
                  className={classesButton.margin}
                  data-testid="receive"
                  onClick={handleClickOpen}
                >
                Receive
              </BootstrapButton>
            </Grid>
            <Grid item xs={6} sm={3} alignItems="center" alignContent="center">
              <BootstrapButton
                  id="send-button"
                  color="primary"
                  onClick={onSendtx}
                  variant="contained"
                  className={classesButton.margin}
                  data-testid="send"
                >
                Send
              </BootstrapButton>
            </Grid>
        </Grid>
      </div>
      <br/>
      <br/>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <List>
            {txs.map((item) => (
              <ListItem>
                <ListItemText primary={`Hash ${item.hash.slice(0,6)}`} />
                <ListItemText secondary={`BlkNum ${item.block_num}`} />
                <ListItemText secondary={`Time ${item.timestamp}`} />
              </ListItem>
            ))}

            </List>
          </div>
        </Grid>
      </Grid>

      <Divider variant="middle" />

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
