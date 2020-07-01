import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getUDTsByLockHash } from '@utils/apis';
import { aggregateUDT } from '@utils/token';
import TokenListComponent from './component';

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
  udtsCapacity: any[];
}

export default () => {
  const [tokenList, setTokenList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();
  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      setLoading(false);
      if (!result.tokenList) return;
      setTokenList(result.tokenList);
    });

    async function getUDTs(): Promise<void> {
      const { currentWallet } = await browser.storage.local.get('currentWallet');
      if (!currentWallet) return;
      const { lock: lockHash } = currentWallet;
      const udtsWithCapacity = await getUDTsByLockHash({
        lockHash,
      });
      console.log('udtsWithCapacity: ', udtsWithCapacity);
      setTokenList(udtsWithCapacity.udts);
    }
    getUDTs();
  }, []);

  if (loading) return <div className={classes.loading}>Loading Token List...</div>;
  if (tokenList.length === 0) return null;
  const udtsCapacity = aggregateUDT(tokenList);
  console.log('udtsCapacity: ', udtsCapacity);

  const resultElem = <TokenListComponent udtsCapacity={udtsCapacity} />;

  return <div className={classes.root}>{resultElem}</div>;
};
