import * as React from 'react';
import * as _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Grid, Button, Dialog, IconButton, Link, Tooltip, Divider, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { useHistory } from 'react-router-dom';
import { createStyles, withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MESSAGE_TYPE, EXPLORER_URL } from '../../../utils/constants';
import { AppContext } from '../../App';
import { truncateAddress, shannonToCKBFormatter } from '../../../utils/formatters';
import { getAddressInfo } from '../../../utils/apis';
const QrCode = require('qrcode.react');
import TxList from '../../Components/TxList';

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
  txHeader: {
    display: 'flex',
    'align-items': 'center',
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
  const [capacity, setCapacity] = React.useState('0');
  const [open, setOpen] = React.useState(false);
  const [tip, setTip] = React.useState('');
  const [txs, setTxs] = React.useState([]);
  const [type, setType] = React.useState('');
  const [disableFlg, setDisableFlg] = React.useState(false);
  const { network } = React.useContext(AppContext);

  const updateCapacity = async (lockHash: string) => {
    const { capacity } = await getAddressInfo(lockHash);
    setCapacity(shannonToCKBFormatter(capacity));
    setLoading(false);
  };

  // FIXME: should not set state in this way
  if (addressFromUrl && addressFromUrl !== address) {
    setAddress(addressFromUrl);
  }

  React.useEffect(() => {
    setTxs([]); // clean tx data

    // if (!addressFromUrl) {
    chrome.storage.local.get(['currentWallet'], async ({ currentWallet }) => {
      if (_.isEmpty(currentWallet)) return;
      const { address, type, lock } = currentWallet;
      setAddress(address);
      if (type == 'Keccak256') {
        setDisableFlg(true);
      } else {
        setDisableFlg(false);
      }
      setType(type);
      updateCapacity(lock);

      chrome.runtime.sendMessage({
        messageType: MESSAGE_TYPE.GET_TX_HISTORY,
      });
    });

    setLoading(true);

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.messageType === MESSAGE_TYPE.SEND_TX_HISTORY && msg.txs) {
        setTxs(msg.txs);
      }
    });
  }, [address, capacity, type]);

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

  const isMnemonicImported = localStorage.getItem('IS_MNEMONIC_SET') === 'YES';

  if (!isMnemonicImported) {
    history.push('./mnemonic-setting');
  }

  const capacityNode = loading ? (
    <div>
      <FormattedMessage id="Loading..." />
    </div>
  ) : (
    <div className="capacity" data-testid="capacity">
      {capacity}
      <span> CKB</span>
    </div>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTip('');
  };

  const txListElem =
    txs.length === 0 ? (
      <div>
        <FormattedMessage id="Go ahead to send your first transaction" />
      </div>
    ) : (
      <TxList txList={txs} />
    );

  return (
    <div className={classes.container}>
      <div>
        <Grid container spacing={2}>
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
            <Box textAlign="center" fontSize={22}>
              {capacityNode}
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
              <FormattedMessage id="Receive" />
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
              <FormattedMessage id="Send" />
            </BootstrapButton>
          </Grid>
        </Grid>
      </div>
      <br />
      <br />

      <div>
        <div className={classes.txHeader}>
          <h3>
            <FormattedMessage id="Latest 20 Transactions" />
          </h3>
          <Link rel="noreferrer" target="_blank" href={`${EXPLORER_URL}/address/${address}`}>
            <Tooltip title="View on Explorer" placement="top">
              <CallMadeIcon />
            </Tooltip>
          </Link>
        </div>
        {txListElem}
      </div>

      <Dialog open={open}>
        <div className={classes.dialogTitle}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.dialogContent}>
          <div className={classes.tip}>{tip}</div>
          {address ? (
            <QrCode value={address} size={200} />
          ) : (
            <div>
              <FormattedMessage id="Loading..." />
            </div>
          )}
          <div className={classes.address}>{address}</div>
        </div>
      </Dialog>
    </div>
  );
}
