import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import TokenListItem, { TTokenInfo } from '../TokenListItem';

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
  udtsMeta: any;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const { udtsCapacity, udtsMeta } = props;
  const addressesElem = Object.keys(udtsCapacity).map((typeHash) => {
    const meta = _.find(udtsMeta, { typeHash });
    const itemProps: TTokenInfo = {
      ...udtsCapacity[typeHash],
      ...meta,
    };
    return (
      <List component="nav" aria-label="Token List" key={`tokenInfo-${typeHash}`}>
        <TokenListItem tokenInfo={itemProps} />
      </List>
    );
  });

  return <div className={classes.root}>{addressesElem}</div>;
};
