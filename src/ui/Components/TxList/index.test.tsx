import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { explorerUrl } from '@src/common/utils/tests/fixtures/token';
import App from './index';
import txList from './fixtures/txList';

describe('TxList', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App txList={txList} explorerUrl={explorerUrl} />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render tx list', () => {
    const list = screen.getAllByRole('list');
    expect(list).toHaveLength(txList.length);
  });

  it('should render tx list', async () => {
    const list = screen.getAllByRole('list');
    userEvent.click(list[0]);
    await waitFor(() => {
      const hash = screen.getByText(txList[0].hash);

      expect(hash).toBeInTheDocument();
    });
  });
});
