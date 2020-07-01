import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import { truncateAddress } from '@utils/formatters';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  inline: {
    display: 'inline',
  },
});

type TTokenInfo = {
  name: string;
  udt: number;
  ckb: number;
};

interface AppProps {
  tokenInfo: TTokenInfo;
}

interface AppState {}

export default (props: AppProps) => {
  const classes = useStyles();
  const {
    tokenInfo: { name, udt, ckb },
  } = props;
  console.log('tokenlist item: props: ', props);
  return (
    <ListItem>
      <ListItemText primary={ckb} secondary={udt} />
    </ListItem>
  );
};
