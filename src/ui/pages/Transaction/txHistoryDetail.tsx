import * as React from 'react';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';

import { MESSAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PageNav from '../../Components/PageNav';

import * as moment from 'moment';

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
  },
  paper: {
    maxWidth: 400,
    marginLeft: '5px',
  },
}));

interface AppProps {}

interface AppState {}

export default function TxHistoryDetail(props: AppProps, state: AppState) {
  const [tx, setTx] = React.useState({});
  const classes = useStyles();

  const viewTxInputs = (inputs) => {
    return inputs.map((item) => {
      return <Typography>{item['address']}</Typography>;
    });
  };

  const viewTxOutputs = (outputs) => {
    return viewTxInputs(outputs);
  };

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      messageType: 'xxxx',
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg.messageType === 'yyyy' && Object.keys(msg.tx).length !== 0) {
        setTx(msg.tx);
      }
    });
  });

  if (Object.keys(tx).length === 0) {
    return <div>loading</div>;
  }

  return (
    <div>
      <PageNav to="/address" title="Address" />

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2} >
            <Grid item xs zeroMinWidth>
              <Avatar>R</Avatar>
              <Typography noWrap>{status}</Typography>
              <Typography noWrap>
                {moment(tx['timestamp']).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <br />
    </div>

      {/* 002 */}
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Typography noWrap>Amount</Typography>
            </Grid>

            <Grid item xs>
              <Typography>{tx['amount'] / 10 ** 8} CKB</Typography>
            </Grid>
          </Grid>

          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Typography noWrap>{tx['income'] ? `Received` : `Send`}</Typography>
            </Grid>
          </Grid>

          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Typography noWrap>Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['fee']}</Typography>
            </Grid>
          </Grid>

          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Typography noWrap>Inputs &nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              {viewTxInputs(tx['inputs'])}
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Outputs&nbsp; </Typography>
            </Grid>
            <Grid item xs>
              {viewTxOutputs(tx['outputs'])}
            </Grid>
          </Grid>
        </Paper>
        <br />
      </div>

      {/* 003 */}
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Tx Hash</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['hash']}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Typography noWrap>Block Number&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['block_num']}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <br />
      </div>
    </div>
  );
}
