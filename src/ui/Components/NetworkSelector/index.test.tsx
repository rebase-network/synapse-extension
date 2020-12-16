import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import NetworkManager from '@common/networkManager';
import App from './index';

describe('NetworkSelector component', () => {
  beforeEach(async () => {
    await NetworkManager.initNetworks();
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App handleNetworkChange={jest.fn()} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render network', () => {
    const lina = screen.getByText('Lina Mainnet');
    expect(lina).toBeInTheDocument();

    userEvent.click(lina);
    const aggron = screen.getByText('Aggron Testnet');
    expect(aggron).toBeInTheDocument();
    userEvent.click(aggron);
    const aggronAfter = screen.getAllByText('Aggron Testnet');
    expect(aggronAfter).toHaveLength(2);
  });
});
