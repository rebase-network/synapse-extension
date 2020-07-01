import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import { shannonToCKBFormatter } from '@utils/formatters';

const useStyles = makeStyles({
  name: {
    maxWidth: 100,
  },
});

export interface TTokenInfo {
  name: string;
  udt: number;
  ckb: number;
  decimal: string;
  symbol: string;
}

interface AppProps {
  tokenInfo: TTokenInfo;
}

interface AppState {}

export default (props: AppProps) => {
  const classes = useStyles();
  const {
    tokenInfo: { name = 'Unknown', udt, ckb, decimal = '8', symbol = '' },
  } = props;
  const decimalInt = parseInt(decimal, 10);
  const ckbStr = ckb.toString();
  console.log('tokenlist item: props: ', props);
  return (
    <ListItem>
      <ListItemText primary={name} />
      <ListItemText
        primary={`${udt / 10 ** decimalInt} ${symbol}`}
        secondary={`${shannonToCKBFormatter(ckbStr)} CKB`}
      />
    </ListItem>
  );
};
