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
import { MAINNET_EXPLORER_URL, TESTNET_EXPLORER_URL, CKB_TOKEN_DECIMALS } from '@utils/constants';

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

export default (props: AppProps) => {
  const classes = useStyles();
  const [explorerUrl, setExplorerUrl] = React.useState(TESTNET_EXPLORER_URL);
  const { data } = props;
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
    typeHash,
    sudt,
  } = data;

  let transferAmount = capacity;
  if (income !== null && income === false) {
    transferAmount = new BN(capacity) - new BN(fee);
  }

  const txDateTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

  React.useEffect(() => {
    browser.storage.local.get('currentNetwork').then(({ currentNetwork = {} }) => {
      const { prefix } = currentNetwork;
      const isMainnet = prefix === 'ckb';
      setExplorerUrl(isMainnet ? MAINNET_EXPLORER_URL : TESTNET_EXPLORER_URL);
    });
  });

  return (
    <div>
      <PageNav to="/address" title="Address" />
      <div className={classes.root}>
        <Grid container>
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
        <Grid container>
          <Grid item xs={3}>
            <Typography noWrap>CKB</Typography>
            {typeHash !== '' ? <Typography noWrap>sUDT</Typography> : null}
          </Grid>
          <Grid item xs={9} data-testid="amount">
            <Typography> {transferAmount / CKB_TOKEN_DECIMALS} CKB</Typography>
            {typeHash !== '' ? <Typography> {sudt} </Typography> : null}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography noWrap>
              <FormattedMessage id="Fee" />
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography> {fee / CKB_TOKEN_DECIMALS} CKB </Typography>
          </Grid>
        </Grid>

        <br />
        <Divider variant="middle" className={classes.divider} />
        <br />
        <Grid container>
          <Grid item xs={3} data-testid="txHash">
            <Typography noWrap>
              <FormattedMessage id="Tx Hash" />
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography className={classes.typography}>
              <Link rel="noreferrer" target="_blank" href={`${explorerUrl}/transaction/${txHash}`}>
                {txHash}
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography noWrap>
              <FormattedMessage id="Block" />
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{blockNum}</Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
