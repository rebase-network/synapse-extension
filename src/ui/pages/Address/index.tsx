import React from 'react';
import { useHistory } from 'react-router-dom';
import TxList from '@ui/Components/TxList';
import TokenList from '@ui/Components/TokenList';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import Address from './Address';

interface AppProps {
  match?: any;
}

export default (props: AppProps) => {
  const history = useHistory();
  const { match } = props;
  const isLogin = localStorage.getItem('IS_LOGIN') === 'YES';
  const [loading, setLoading] = React.useState(true);
  const [txs, setTxs] = React.useState([]);
  React.useEffect(() => {
    setTxs([]); // clean tx data

    setLoading(true);

    browser.runtime.sendMessage({
      type: MESSAGE_TYPE.GET_TX_HISTORY,
    });

    const listener = (message) => {
      if (message.type === MESSAGE_TYPE.SEND_TX_HISTORY && message.txs) {
        setTxs(message.txs);
        setLoading(false);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  if (!isLogin) {
    history.push('./mnemonic-setting');
    return null;
  }

  return (
    <Address match={match} TxList={TxList} TokenList={TokenList} txs={txs} loading={loading} />
  );
};
