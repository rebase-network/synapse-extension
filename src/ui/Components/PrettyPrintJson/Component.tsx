import React from 'react';

interface AppProps {
  tx?: CKBComponents.RawTransactionToSign | any;
}

export default (props: AppProps) => {
  const { tx } = props;

  return <pre style={{ overflow: 'scroll' }}>{JSON.stringify(tx, null, 2)}</pre>;
};
