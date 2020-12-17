import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { explorerUrl } from '@src/common/utils/tests/fixtures/token';
import tokenInfo from './fixtures/tokenInfo';
import App from './index';

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

describe('token list item comopnent', () => {
  it('should render Love Lina Token', async () => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App explorerUrl={explorerUrl} tokenInfo={tokenInfo[0]} sendLink="" />
        </Router>
      </IntlProvider>,
    );
    const loading = screen.getByText('Love Lina Token');
    expect(loading).toBeInTheDocument();
  });

  it('should render unnamed token', async () => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App explorerUrl={explorerUrl} tokenInfo={tokenInfo[1]} sendLink="" />
        </Router>
      </IntlProvider>,
    );
    const loading = screen.getByText(tokenInfo[1].typeHash.substr(0, 10));
    expect(loading).toBeInTheDocument();
  });

  it('should render ckb token', async () => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App explorerUrl={explorerUrl} tokenInfo={tokenInfo[2]} sendLink="" />
        </Router>
      </IntlProvider>,
    );
    const loading = screen.getByText('494 CKB');
    expect(loading).toBeInTheDocument();
  });
});
