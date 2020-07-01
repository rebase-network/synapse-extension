import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

export default (props: AppProps) => {
  const [tokenList, setTokenList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();
  const { udtsCapacity } = props;
  console.log('props: ', props);
  React.useEffect(() => {
    browser.storage.local.get('tokenList').then((result) => {
      setLoading(false);
      if (!result.tokenList) return;
      setTokenList(result.tokenList);
    });
  }, []);

  if (loading) return <div className={classes.loading}>Loading Token List...</div>;

  const resultElem = <TokenListComponent udtsCapacity={udtsCapacity} />;

  return <div className={classes.root}>{resultElem}</div>;
};
