import React from 'react';
import { useHistory } from 'react-router-dom';
import Address from './Address';

interface AppProps {
  match?: any;
}

export default (props: AppProps) => {
  const history = useHistory();
  const { match } = props;
  const isLogin = localStorage.getItem('IS_LOGIN') === 'YES';

  if (!isLogin) {
    history.push('./mnemonic-setting');
    return null;
  }

  return <Address match={match} />;
};
