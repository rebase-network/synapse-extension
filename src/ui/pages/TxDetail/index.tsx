import * as React from 'react';

import { Link } from '@material-ui/core';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import SyncIcon from '@material-ui/icons/Sync';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';

import PageNav from '../../Components/PageNav';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 30,
  },
  button: {},
  textField: {},
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    margin: `${theme.spacing(1)}px auto`,
    marginTop: '20',
    marginBottom: '20',
    // padding: theme.spacing(0, 3),
  },
  divider: {
    marginTop: '20',
    marginBottom: '20',
  },
  typography: {
    overflowWrap: "anywhere",
  }
}));

interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();

  const [status, setStatus] = React.useState('');
  const [capacity, setCapacity] = React.useState(0);
  const [fee, setFee] = React.useState(0);
  const [inputs, setInputs] = React.useState('');
  const [outputs, setOutputs] = React.useState('');
  const [txHash, setTxHash] = React.useState('');
  const [block, setBlock] = React.useState('');
  const [txDateTime, setTxDateTime] = React.useState("");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.TX_DETAIL) {
        setCapacity(message.capacity / (10 ** 8));
        setFee(message.fee / (10 ** 8));
        setInputs(message.inputs);
        setOutputs(message.outputs);
        setTxHash(message.txHash);
        setStatus(message.status);
        setBlock(message.blockNumber);
        const dateTimeStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        setTxDateTime(dateTimeStr);
      }
    });
  }, []);

  let statusIconNode = <Box textAlign="center" fontSize={40}>
    <SyncIcon />
  </Box>;
  if (status == "finished") {
    statusIconNode = <Box textAlign="center" fontSize={40}>
      <CheckCircleIcon />
    </Box>
  }
  return (
    <div>
      <PageNav to="/address" title="Address" />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <Box textAlign="center" fontSize={40}>
                  <SyncIcon/>
              </Box> */}
            {statusIconNode}
            <Box textAlign="center" fontSize={22}>
              {status}
            </Box>
            <Box textAlign="center" fontSize={16}>
              {txDateTime}
            </Box>
          </Grid>
        </Grid>
        <br />
        <Divider variant="middle" className={classes.divider} />
        <br />
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>&nbsp;&nbsp;Capacity&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{capacity} CKB</Typography>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>&nbsp;&nbsp;Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{fee} CKB </Typography>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>&nbsp;&nbsp;Inputs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs>
            <Typography className={classes.typography}>{inputs}</Typography>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>&nbsp;Outputs &nbsp;&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs>
            <Typography className={classes.typography}>{outputs}</Typography>
          </Grid>
        </Grid>
        <br />
        <Divider variant="middle" className={classes.divider} />
        <br />
        <Grid container wrap="nowrap" spacing={2} >
          <Grid item>
            <Typography noWrap>&nbsp;&nbsp;Tx Hash&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs >
            <Link
              rel="noreferrer"
              target="_blank"
              href={'https://explorer.nervos.org/aggron/transaction/' + txHash}
            >
              <Typography className={classes.typography}>{txHash}</Typography>
            </Link>
          </Grid>
        </Grid>
        {/* <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>&nbsp;&nbsp;Block&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{block}</Typography>
          </Grid>
        </Grid> */}
      </div>
    </div>
  );
}
