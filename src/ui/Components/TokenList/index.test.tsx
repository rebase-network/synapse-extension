import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import NetworkManager from '@common/NetworkManager';
import { udtsCapacity, udtsMeta, explorerUrl } from '@src/common/utils/tests/fixtures/token';
import App from './index';
import udtsFixture from './fixtures/udts';
import currentWalletFixture from './fixtures/currentWallet';

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
  const history = useHistory();
  beforeEach(async () => {
    await browser.storage.local.set({ udts: udtsFixture, currentWallet: currentWalletFixture });
    await NetworkManager.initNetworks();
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

  it('should not render any udt', async () => {
    const loading = screen.getByText(/Loading UDT/i);
    expect(loading).toBeInTheDocument();
    // await waitForElementToBeRemoved(screen.getByText(/Loading UDT/i));
    // const elem = screen.getByText('TLT');
    // expect(elem).toBeInTheDocument();
  });
});
