import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';

import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import * as moment from 'moment';


const useStyles = makeStyles((theme) => ({
  container: {
    margin: 30,
  },
  button: {

  },
  textField: {

  },
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

interface AppProps { }

interface AppState { }

export default function TxHistoryDetail(props: AppProps, state: AppState) {
  const [tx, setTx] = React.useState({});
  const classes = useStyles();

  React.useEffect(() => {

    chrome.runtime.sendMessage({
      messageType: "xxxx"
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {

      if (msg.msgType === "yyyy") {
        if (!!msg.tx) {
          setTx(tx)

          alert(tx['fee'])
        }
      }
    })

  }, [])

  return (
    <div>
      <div className={classes.root}>
        <Paper className={classes.paper} >
          <Grid container wrap="nowrap" spacing={2} alignContent="center" alignItems="center">
            <Grid item xs zeroMinWidth>
              <Avatar>W</Avatar>
              <Typography noWrap>{status}</Typography>
              <Typography noWrap>{moment(tx['timestamp']).format("YYYY-DD-MM hh:mm:ss")}</Typography>
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
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Amount </Typography>
            </Grid>
            <Grid item xs>
              <Typography></Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['fee']}</Typography>
            </Grid>
          </Grid>

          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap >Inputs &nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
             <Typography>{tx['inputs']}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap >Outputs&nbsp; </Typography>
            </Grid>
            <Grid item xs>
             <Typography>{tx['outputs']}</Typography>
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
              <Typography noWrap >Tx Hash</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['hash']}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap >Block Number&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{tx['block_num']}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <br />
      </div>
    </div>
  )
}
