import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import TokenListItem, { ITokenInfo } from '../TokenListItem';

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
  explorerUrl: any;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const { udtsCapacity, udtsMeta, explorerUrl } = props;
  const addressesElem = Object.keys(udtsCapacity).map((typeHash) => {
    const meta = _.find(udtsMeta, { typeHash });
    const itemProps: ITokenInfo = {
      ...udtsCapacity[typeHash],
      ...meta,
      typeHash,
    };
    return (
      <List component="nav" aria-label="Token List" key={`tokenInfo-${typeHash}`}>
        <TokenListItem tokenInfo={itemProps} explorerUrl={explorerUrl} />
      </List>
    );
  });

  return <div className={classes.root}>{addressesElem}</div>;
};
