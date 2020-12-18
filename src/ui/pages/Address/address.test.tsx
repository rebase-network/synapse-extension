import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

jest.mock('@ui/Components/TokenList');

describe('Address page', () => {
  beforeEach(async () => {
    await browser.storage.local.set({ currentWallet });
    await NetworkManager.initNetworks();

    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render capacity', () => {
    const capacity = screen.getByText('Loading...');
    expect(capacity).toBeInTheDocument();
  });

  it('should render receive / send btn', () => {
    const receiveBtn = screen.getByRole('button', { name: 'Receive' });
    const sendBtn = screen.getByRole('button', { name: 'Send' });
    expect(receiveBtn).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();
  });

  it('should render capacity refresh button', () => {
    const result = screen.getByRole('button', { name: /CKB|\.\.\./i });
    expect(result).toBeInTheDocument();
  });

  it('should render tx list', () => {
    const result = screen.getByText('Latest 20 Transactions');
    expect(result).toBeInTheDocument();
  });

  it('should render Show UDT button', async () => {
    const result = screen.getByText('Show UDT');
    expect(result).toBeInTheDocument();
    userEvent.click(result);
    expect(screen.getByText('Hide UDT')).toBeInTheDocument();
  });
});
