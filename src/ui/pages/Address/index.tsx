import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
  Grid,
  ListSubheader,
  ListItem,
  ListItemText,
  List,
  Button,
  Dialog,
  IconButton,
  Link,
  Tooltip,
} from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { createStyles, withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { AppContext } from '../../App';
import { truncateAddress } from '../../../utils/formatters';
import { getBalanceByAddress } from '../../../utils/apis';
const QrCode = require('qrcode.react');

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    textAlign: 'center',
  },
  dialogTitle: {
    textAlign: 'right',
  },
  dialogContent: {
    padding: '0 16px 24px',
    textAlign: 'center',
    minWidth: 200,
  },
  address: {
    marginTop: 16,
    fontSize: 12,
    'word-break': 'break-all',
  },
  loading: {
    width: 200,
    padding: 24,
    textAlign: 'center',
  },
  tip: {
    marginBottom: 24,
    color: 'green',
  },
});

const BootstrapButton = withStyles({
  root: {
    // margin: theme.spacing(1),
    width: '88px',
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

interface AppProps {}

interface AppState {}

type searchObj = {
  address: string;
  type: string;
};

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const history = useHistory();
  const addressFromUrl = _.get(props, 'match.params.address', '');

  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState(addressFromUrl);
  const [balance, setBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [tip, setTip] = React.useState('');
  const [txs, setTxs] = React.useState([]);
  const [type, setType] = React.useState('');
  const [disableFlg, setDisableFlg] = React.useState(false);
  const { network } = React.useContext(AppContext);

  const updateBalance = async (address) => {
    const balance = await getBalanceByAddress(address);
    setBalance(balance / 10 ** 8);
    setLoading(false);
  };

  // FIXME: should not set state in this way
  if (addressFromUrl && addressFromUrl !== address) {
    setAddress(addressFromUrl);
  }

  React.useEffect(() => {
    // if (!addressFromUrl) {
    chrome.storage.local.get(['currentWallet'], async ({ currentWallet }) => {
      if (!currentWallet && !currentWallet.address) return;
      const { address, type } = currentWallet;
      setAddress(address);
      if (type == 'Keccak256' || type == 'AnyPay') {
        setDisableFlg(true);
      } else {
        setDisableFlg(false);
      }
      setType(type);
      updateBalance(address);
    });
    // } else {
    //   updateBalance(addressFromUrl);
    // }

    setLoading(true);

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.GET_TX_HISTORY,
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.messageType === MESSAGE_TYPE.SEND_TX_HISTORY && msg.txs) {
        setTxs(msg.txs);
      }
    });
  }, [address, balance, type]);

  const onSendtx = () => {
    history.push('/send-tx');
  };

  React.useEffect(() => {
    (async function copyAddress() {
      if (open && address) {
        await navigator.clipboard.writeText(address);
        setTip('Address has been copied to clipboard');
      }
    })();
  }, [open, address]);

  const isMnemonicImported = localStorage.getItem('IS_MNEMONIC_IMPORTED') === 'YES';

  if (!isMnemonicImported) {
    history.push('./mnemonic-setting');
  }

  const balanceNode = loading ? (
    <div>loading</div>
  ) : (
    <div className="balance" data-testid="balance">
      {balance}
      <span> CKB</span>
    </div>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onTxDetail = () => {
    history.push('/tx-history-detail');
  };

  const handleClose = () => {
    setOpen(false);
    setTip('');
  };

  return (
    <div className={classes.container}>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box textAlign="center" fontSize={22}>
              Address
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center" fontSize={22}>
              {truncateAddress(address)}
            </Box>
            <Box textAlign="center" fontSize={16}>
              {type}
            </Box>
          </Grid>
        </Grid>
        <br />
        <Divider variant="middle" />
        <br />
        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <Paper className={classesTheme.paper}>{balanceNode}</Paper> */}
            <Box textAlign="center" fontSize={22}>
              {balanceNode}
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} className={classes.button}>
            <BootstrapButton
              type="button"
              id="receive-button"
              color="primary"
              variant="contained"
              data-testid="receive"
              onClick={handleClickOpen}
            >
              Receive
            </BootstrapButton>
          </Grid>
          <Grid item xs={6} sm={6} className={classes.button}>
            <BootstrapButton
              id="send-button"
              color="primary"
              onClick={onSendtx}
              variant="contained"
              data-testid="send"
              disabled={disableFlg}
            >
              Send
            </BootstrapButton>
          </Grid>
        </Grid>
      </div>
      <br />
      <br />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <ListSubheader>Transactions</ListSubheader>
            <Divider />
            {txs.map((item) => (
              <List onClick={onTxDetail}>
                <ListItem>
                  <ListItemText primary={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />

                  <Link
                    rel="noreferrer"
                    target="_blank"
                    href={'https://explorer.nervos.org/aggron/transaction/' + item.hash}
                  >
                    <Tooltip title="View on Explorer" placement="top">
                      <CallMadeIcon />
                    </Tooltip>
                  </Link>
                </ListItem>
                <ListItem>
                  <ListItemText secondary={`${item.amount / 10 ** 8} CKB`} />
                  <ListItemText secondary={item.income ? `Received` : `Send`} />
                </ListItem>
                <Divider />
              </List>
            ))}
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
          <div className={classes.tip}>{tip}</div>
          {address ? <QrCode value={address} size={200} /> : <div>loading</div>}
          <div className={classes.address}>{address}</div>
        </div>
      </Dialog>
    </div>
  );
}
