import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import NetworkManager from '@common/networkManager';
import currentWallet from './fixtures/currentWallet';
import App from './Address';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: () => ({
      push: jest.fn(),
    }),
  };
});

const TxList = () => <div>TxList</div>;
const TokenList = () => <div>TokenList</div>;
const txs = [];
const loading = false;

describe('Address page', () => {
  beforeEach(async () => {
    await browser.storage.local.set({ currentWallet });
    await NetworkManager.initNetworks();

    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App TxList={TxList} TokenList={TokenList} txs={txs} loading={loading} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render receive / send btn', async () => {
    const receiveBtn = screen.getByRole('button', { name: 'Receive' });
    const sendBtn = screen.getByRole('button', { name: 'Send' });
    expect(receiveBtn).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();
  });

  it('should render capacity refresh button', async () => {
    const result = screen.getByRole('button', { name: /ckb1qyqgad...l56qp73mg0/i });
    expect(result).toBeInTheDocument();
  });

  it('should render tx list', async () => {
    const result = screen.getByText('Latest 20 Transactions');
    expect(result).toBeInTheDocument();
  });

  it('should render Show UDT button', async () => {
    const result = screen.getByText('Show UDT');
    expect(result).toBeInTheDocument();
  });
});
