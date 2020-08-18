import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import TxDetail from './index';
import { tx } from './fixture';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('txDetail page', () => {
  let container;
  let getByTestId;

  beforeEach(() => {
    const tree = render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <TxDetail data={tx} />
        </Router>
      </IntlProvider>,
    );

    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  it('should render amount', async () => {
    const amount = getByTestId('amount');
    expect(container).toContainElement(amount);
    // expect(amount).toHaveTextContent((tx.amount / 10 ** 8).toString());
    expect(amount).toHaveTextContent('0.000001 CKB');
  });

  it('should render TxHash', async () => {
    const txHash = getByTestId('txHash');
    expect(container).toContainElement(txHash);
    expect(txHash).toHaveTextContent('Tx Hash');
  });
});
