import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { getUDTsByLockHash } from '@utils/apis';
import { aggregateUDT } from '@utils/token';
import TokenListComponent from './component';

const useStyles = makeStyles({
  root: {},
  loading: {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default () => {
  const [tokenList, setTokenList] = React.useState([]);
  const [udtsMeta, setUdtsMeta] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();
  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      setLoading(false);
      if (!result.udts) return;
      setUdtsMeta(result.udts);
    });

    async function getUDTs(): Promise<void> {
      const { currentWallet } = await browser.storage.local.get('currentWallet');
      if (!currentWallet) return;
      const { lock: lockHash } = currentWallet;
      const udtsWithCapacity = await getUDTsByLockHash({
        lockHash,
      });
      setTokenList(udtsWithCapacity.udts);
    }
    getUDTs();
  }, []);

  if (loading) {
    return (
      <div className={classes.loading}>
        <FormattedMessage id="Loading UDT..." />
      </div>
    );
  }
  if (tokenList.length === 0) {
    return (
      <div className={classes.loading}>
        <FormattedMessage id="No UDT found" />
      </div>
    );
  }

  const udtsCapacity = aggregateUDT(tokenList);

  const resultElem = <TokenListComponent udtsCapacity={udtsCapacity} udtsMeta={udtsMeta} />;

  return <div className={classes.root}>{resultElem}</div>;
};
