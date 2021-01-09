import React from 'react';
import RawTxDetail from '@ui/Components/PrettyPrintJson';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import Component from './Component';

export default () => {
  const [message, setMessage] = React.useState({} as any);
  React.useEffect(() => {
    const listener = (msg) => {
      if (
        msg.type === MESSAGE_TYPE.EXTERNAL_SEND ||
        msg.type === MESSAGE_TYPE.EXTERNAL_SIGN ||
        msg.type === MESSAGE_TYPE.EXTERNAL_SIGN_SEND
      ) {
        setMessage(msg);
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  return <Component RawTxDetail={RawTxDetail} message={message} />;
};
