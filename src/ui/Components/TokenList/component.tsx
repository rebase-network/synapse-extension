import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { List, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import TokenListItem, { ITokenInfo } from '../TokenListItem';

const useStyles = makeStyles({
  root: {},
  loading: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLink: {
    cursor: 'pointer',
    'text-decoration': 'underline',
  }
});

interface AppProps {
  udtsCapacity: any;
  udtsMeta: any;
  explorerUrl: any;
}

export default (props: AppProps) => {
  const history = useHistory();
  const classes = useStyles();

  const { udtsCapacity, udtsMeta, explorerUrl } = props;

  const addressesElem = Object.keys(udtsCapacity).map((typeHash) => {
    const meta = _.find(udtsMeta, { typeHash });
    const itemProps: ITokenInfo = {
      ...udtsCapacity[typeHash],
      ...meta,
      typeHash,
    };

    const handleClick = async (event, itemPropsParams) => {
      const { name, typeHash: typeHashItem, udt } = itemPropsParams;
      let decimal = itemPropsParams?.decimal;
      if (decimal === undefined || decimal === null) {
        decimal = '8';
      }
      history.push(`/send-tx?name=${name}&typeHash=${typeHashItem}&udt=${udt}&decimal=${decimal}`);
    };

    const sendLink = typeHash !== 'null' && (
      <span onClick={(event) => handleClick(event, itemProps)} className={classes.sendLink}>
        <FormattedMessage id="Send" />
      </span>
    )

    return (
      <List component="nav" aria-label="Token List" key={`tokenInfo-${typeHash}`}>
        <TokenListItem tokenInfo={itemProps} sendLink={sendLink} explorerUrl={explorerUrl} />
      </List>
    );
  });

  return <div className={classes.root}>{addressesElem}</div>;
};
