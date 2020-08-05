import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TxList from './index';
import { txList } from './fixture';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { explorerUrl } from '@utils/tests/fixtures/token';

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
