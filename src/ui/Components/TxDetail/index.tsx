import React from 'react';
import moment from 'moment';
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import PageNav from '@ui/Components/PageNav';
import { BN } from 'bn.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    margin: `${theme.spacing(1)}px auto`,
    padding: 15,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
  typography: {
    overflowWrap: 'anywhere',
  },
}));

interface AppProps {
  data: any;
}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();

  const {
    status = 'Confirmed',
    amount: capacity,
    fee,
    // inputs,
    // outputs,
    hash: txHash,
    blockNum,
    timestamp,
    income,
  } = props.data;

  let transferAmount = capacity;
  if (income !== null && income === false) {
    transferAmount = new BN(capacity) - new BN(fee);
  }

  const txDateTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

  return (
    <div>
      <PageNav to="/address" title="Address" />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
            <Typography noWrap>
              <FormattedMessage id="Capacity" />
            </Typography>
          </Grid>
          <Grid item xs data-testid="amount">
            <Typography> {transferAmount / 10 ** 8} CKB</Typography>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>
              <FormattedMessage id="Fee" />
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography> {fee / 10 ** 8} CKB </Typography>
          </Grid>
        </Grid>

        <br />
        <Divider variant="middle" className={classes.divider} />
        <br />
        <Grid container wrap="nowrap" spacing={2}>
          <div data-testid="txHash">
            <Typography noWrap>
              <FormattedMessage id="Tx Hash" />
            </Typography>
          </div>
          <Grid item xs>
            <Link
              rel="noreferrer"
              target="_blank"
              href={`https://explorer.nervos.org/aggron/transaction/${txHash}`}
            >
              <Typography className={classes.typography}>{txHash}</Typography>
            </Link>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Typography noWrap>
              <FormattedMessage id="Block" />
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography>{blockNum}</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
