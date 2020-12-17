import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import TxDetail from './index';
import { tx } from './fixture';

const mockFunc = jest.fn();

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: () => {
      return { push: mockFunc };
    },
    Link: 'a',
  };
});

describe('txDetail componnet', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <TxDetail data={tx} />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render amount', async () => {
    const amount = screen.getByText('0.000001 CKB');
    expect(amount).toBeInTheDocument();
  });

  it('should render TxHash', async () => {
    const txHash = screen.getByText('Tx Hash');
    expect(txHash).toBeInTheDocument();
  });
});
