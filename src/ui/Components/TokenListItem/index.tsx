import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import { shannonToCKBFormatter } from '@utils/formatters';

const useStyles = makeStyles({
  token: {
    'text-align': 'right',
  },
});

export interface TTokenInfo {
  name: string;
  udt: number;
  ckb: number;
  decimal: string;
  symbol: string;
  typeHash: string;
}

interface AppProps {
  tokenInfo: TTokenInfo;
}

interface AppState {}

export default (props: AppProps) => {
  const classes = useStyles();
  const {
    tokenInfo: { name, udt, ckb, decimal = '8', symbol = '', typeHash },
  } = props;
  let displayName = name;
  if (!name) {
    if (typeHash === 'null') {
      displayName = 'CKB (Full)';
    } else {
      displayName = typeHash.substr(0, 10);
    }
  }
  const decimalInt = parseInt(decimal, 10);
  const ckbStr = ckb.toString();
  console.log('tokenlist item: props: ', props);
  return (
    <ListItem>
      <ListItemText primary={displayName} />
      <ListItemText
        primary={`${udt / 10 ** decimalInt} ${symbol}`}
        secondary={`${shannonToCKBFormatter(ckbStr)} CKB`}
        className={classes.token}
      />
    </ListItem>
  );
};
