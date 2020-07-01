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

export default () => {
  const [tokenList, setAddressesList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    browser.storage.local.get('tokenList').then((result) => {
      setLoading(false);
      if (!result.tokenList) return;
      setAddressesList(result.tokenList);
    });
  }, [tokenList]);

  if (loading) return <div className={classes.loading}>Loading Token List...</div>;

  const addressesElem = tokenList.map((addressesObj) => {
    return addressesObj.addresses.map((item) => {
      return (
        <List component="nav" aria-label="Token List" key={`item-${item.address}`}>
          <TokenListItem
            key={`item-${item.address}`}
            tokenInfo={{ ...item, publicKey: addressesObj.publicKey }}
          />
        </List>
      );
    });
  });

  return <div className={classes.root}>{addressesElem}</div>;
};
