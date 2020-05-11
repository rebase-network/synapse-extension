import * as React from 'react';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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
    // padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 400,
    marginLeft: '5px',
    // margin: `${theme.spacing(1)}px auto`,
    // padding: theme.spacing(2),
  },
}));

interface AppProps {}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();

  const [status, setStatus] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [fee, setFee] = React.useState(0);
  const [inputs, setInputs] = React.useState('');
  const [outputs, setOutputs] = React.useState('');
  const [txHash, setTxHash] = React.useState('');
  const [block, setBlock] = React.useState('');

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.TX_DETAIL) {
        setAmount(message.tradeAmount);
        setStatus(message.status);
        setFee(message.fee);
        setInputs(message.inputs);
        setOutputs(message.outputs);
        setTxHash(message.txHash);
        setBlock(message.block);
      }
    });
  }, []);

  return (
    <div>
      {/* 001- */}
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2} >
            {/* <Grid item>
              <Avatar>W</Avatar>
            </Grid> */}
            <Grid item xs zeroMinWidth>
              <Avatar>W</Avatar>
              <Typography noWrap>{status}</Typography>
              <Typography noWrap>03/03/2020 12:30</Typography>
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
              <Typography>{amount}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{fee}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Inputs &nbsp;&nbsp;</Typography>
            </Grid>
            <Grid item xs>
              <Typography>{inputs}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Outputs&nbsp; </Typography>
            </Grid>
            <Grid item xs>
              <Typography>{outputs}</Typography>
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
              <Typography>{txHash}</Typography>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              {/* <Avatar>W</Avatar> */}
              <Typography noWrap>Block&nbsp;&nbsp;&nbsp;&nbsp; </Typography>
            </Grid>
            <Grid item xs>
              <Typography>{block}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <br />
      </div>
    </div>

    // <div className={classes.container}>
    //   <Title title="Transaction Detail" testId="tx-detail-title" />
    //   <div className="status" data-testid="status">
    //       <span className="">status  </span>
    //       {status}
    //   </div>
    //   <br/>
    //   <br/>
    //   <div className="amount" data-testid="amount">
    //       <span className="">Amount  </span>
    //       {amount}
    //       <span className="">  CKB</span>
    //   </div>
    //   <br/>

    //   <div className="fee" data-testid="fee">
    //       <span className="">Fee  </span>
    //       {fee}
    //       <span className="">  CKB</span>
    //   </div>
    //   <br/>

    //   <div className="inputs" data-testid="inputs">
    //       <span className="">inputs  </span>
    //       {inputs}
    //   </div>
    //   <br/>

    //   <div className="outputs" data-testid="outputs">
    //       <span className="">outputs  </span>
    //       {outputs}
    //   </div>
    //   <br/>

    //   <div className="" data-testid="">
    //       <span className=""> ------------ </span>
    //   </div>
    //   <br/>

    //   <div className="txHash" data-testid="txHash">
    //       <span className=""> TxHash </span>
    //       {txHash}
    //   </div>
    //   <br/>
    // </div>
  );
}
