import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { explorerUrl } from '@src/common/utils/tests/fixtures/token';
import TxList from './index';
import { txList } from './fixture';

describe('TxList', () => {
  let tree;
  let container;
  let getByTestId;
  beforeAll(() => {
    tree = render(
      <IntlProvider locale="en" messages={en}>
        <TxList txList={txList} explorerUrl={explorerUrl} />
      </IntlProvider>,
    );
    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  it('should render tx list', () => {
    const elem = getByTestId('container');
    expect(container).toContainElement(elem);
  });
});
