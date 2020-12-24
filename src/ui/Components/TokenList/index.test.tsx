import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import NetworkManager from '@common/networkManager';
import { networks } from '@src/common/utils/constants/networks';
import { explorerUrl } from '@common/utils/tests/fixtures/token';
import App from './index';
import udtsFixture from './fixtures/udts';
import currentWalletFixture from './fixtures/currentWallet';

jest.mock('@common/utils/apis');

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

describe('token list', () => {
  beforeEach(async () => {
    await browser.storage.local.set({ udts: udtsFixture, currentWallet: currentWalletFixture });
    await NetworkManager.initNetworks();
    await NetworkManager.setCurrentNetwork(networks[1].title);
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App explorerUrl={explorerUrl} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render udt', async () => {
    const loading = screen.getByText(/2923.332 TLT/i);
    expect(loading).toBeInTheDocument();
  });
});
