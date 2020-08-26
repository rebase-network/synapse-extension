import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import { getUDTsByLockHash } from '@utils/apis';
import { aggregateUDT } from '@utils/token';
import { shannonToCKBFormatter } from '@utils/formatters';
import { TypesInfo } from '@src/utils/constants/typesInfo';
import NetworkManager from '@src/common/networkManager';
import _ from 'lodash';
import TokenListComponent from './component';

const useStyles = makeStyles({
  root: {},
  loading: {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: {
    'text-align': 'right',
  },
  ckb: {
    'border-bottom': '1px solid #ccc',
  },
});

interface AppProps {
  explorerUrl: string;
}

export default (props: AppProps) => {
  const [tokenList, setTokenList] = React.useState([]);
  const [udtsMeta, setUdtsMeta] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [emptyCapacity, setEmptyCapacity] = React.useState('0');
  const { explorerUrl } = props;

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
      const AllWithCapacity = await getUDTsByLockHash({
        lockHash,
      });

      const { networkType } = await NetworkManager.getCurrentNetwork();
      const typeInfo = TypesInfo[networkType.toLowerCase()];
      const sudtCodeHash = typeInfo.simpleudt.codeHash;
      // Just Show Simple UDT
      const udtsAllWithCapacity = AllWithCapacity.udts;
      const udts = _.filter(udtsAllWithCapacity, function find(item) {
        return item.type === null || item.type.codeHash === sudtCodeHash;
      });

      setTokenList(udts);
      setEmptyCapacity(shannonToCKBFormatter(AllWithCapacity.capacity));
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
  if (tokenList === undefined || tokenList.length === 0) {
    return (
      <div className={classes.loading}>
        <FormattedMessage id="No UDT found" />
      </div>
    );
  }

  const udtsCapacity = aggregateUDT(tokenList);
  const resultElem = (
    <TokenListComponent udtsCapacity={udtsCapacity} udtsMeta={udtsMeta} explorerUrl={explorerUrl} />
  );

  return (
    <div className={classes.root}>
      <ListItem disableGutters className={classes.ckb}>
        <ListItemText primary="CKB" />
        <ListItemText primary={`${emptyCapacity} CKB`} className={classes.token} />
      </ListItem>
      {resultElem}
    </div>
  );
};
