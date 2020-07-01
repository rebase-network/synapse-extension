import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import TokenListItem from '../TokenListItem';

const useStyles = makeStyles({
  root: {},
  loading: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface AppProps {
  udtsCapacity: any;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const { udtsCapacity } = props;

  const addressesElem = Object.keys(udtsCapacity).map((typeHash) => {
    return (
      <List component="nav" aria-label="Token List" key={`tokenInfo-${typeHash}`}>
        <TokenListItem tokenInfo={udtsCapacity[typeHash]} />
      </List>
    );
  });

  return <div className={classes.root}>{addressesElem}</div>;
};
