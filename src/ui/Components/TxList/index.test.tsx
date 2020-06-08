import * as React from 'react';
import TxList from './index';
import { txList } from './fixture';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import en from '../../pages/locales/en';

describe('TxList', () => {
  let tree, container, getByTestId;
  beforeAll(() => {
    tree = render(
      <IntlProvider locale="en" messages={en}>
        <TxList txList={txList} />
      </IntlProvider>,
    );
    container = tree.container;
    getByTestId = tree.getByTestId;
  });
  afterEach(cleanup);

  it('should render tx list', () => {
    const elem = getByTestId('container');
    expect(container).toContainElement(elem);
  });
});
