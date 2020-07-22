import React from 'react';

interface AppProps {
  tx?: CKBComponents.RawTransactionToSign | any;
}

export default (props: AppProps) => {
  const { tx } = props;
  const inputs = tx?.inputs.map((input, index) => (
    <li key={input.previousOutput.txHash + index}>{input.previousOutput.txHash}</li>
  ));
  const outputs = tx?.outputs.map((output, index) => (
    <li key={output.lock.args + index}>{output.capacity}</li>
  ));
  return (
    <div>
      <ul>{inputs}</ul>
      <ul>{outputs}</ul>
    </div>
  );
};
