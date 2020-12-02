import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, Tooltip } from '@material-ui/core';
import { getUDTsByLockHash } from '@utils/apis';
import { aggregateUDT } from '@utils/token';
import { shannonToCKBFormatter } from '@utils/formatters';
import { TypesInfo } from '@utils/constants/typesInfo';
import NetworkManager from '@src/common/networkManager';
import _ from 'lodash';
import { HelpOutline } from '@material-ui/icons';
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
  ckbFull: {
    display: 'flex',
    'align-items': 'center',
  },
  ckbFullText: {
    'margin-right': 8,
  },
  helpIcon: {
    'font-size': '1.2rem',
    color: 'gray',
  },
  displayName: {
    color: 'inherit',
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
  const [othersCapacity, setOthersCapacity] = React.useState('0');
  const { explorerUrl } = props;

  const classes = useStyles();
  React.useEffect(() => {
    browser.storage.local.get('udts').then((result) => {
      if (!result.udts) return;
      setUdtsMeta(result.udts);
    });

    async function getUDTs(): Promise<void> {
      const { currentWallet } = await browser.storage.local.get('currentWallet');
      if (!currentWallet) {
        setLoading(false);
        return;
      }
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
      setLoading(false);
      setEmptyCapacity(shannonToCKBFormatter(AllWithCapacity.capacity));

      // expect SUDT
      const others = _.filter(udtsAllWithCapacity, function find(item) {
        return item.typeHash !== null && item.type.codeHash !== sudtCodeHash;
      });
      const othersCellsCapacity = others.reduce(
        (prev, next) => BigInt(prev) + BigInt(next.capacity),
        0,
      );
      setOthersCapacity(othersCellsCapacity);
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
  if (!loading && (tokenList === undefined || tokenList.length === 0)) {
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

  const displayName = (
    <Tooltip
      title={<FormattedMessage id="CKB with data inside, it's not UDT" />}
      arrow
      placement="top"
    >
      <div className={classes.ckbFull}>
        <span className={classes.ckbFullText}>Other (Full)</span>
        <HelpOutline className={classes.helpIcon} />
      </div>
    </Tooltip>
  );

  return (
    <div className={classes.root}>
      <ListItem disableGutters className={classes.ckb}>
        <ListItemText primary="CKB" />
        <ListItemText primary={`${emptyCapacity} CKB`} className={classes.token} />
      </ListItem>
      {resultElem}
      {/* other Cells except SUDT */}
      <ListItem disableGutters className={classes.ckb}>
        <ListItemText primary={displayName} />
        <ListItemText
          primary="0"
          secondary={`${shannonToCKBFormatter(othersCapacity.toString())} CKB`}
          className={classes.token}
        />
      </ListItem>
    </div>
  );
};
