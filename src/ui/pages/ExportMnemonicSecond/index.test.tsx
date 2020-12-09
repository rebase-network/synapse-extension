import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import en from '@common/locales/en';
import App from './index';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: () => {
      return { push: jest.fn() };
    },
  };
});

describe('export mnemonic page', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });
  it('should render title', () => {
    const result = screen.getByText('Export Mnemonic');
    expect(result).toBeInTheDocument();
  });

  it('send message', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT,
        mnemonic: 'abc bcd',
      });
      expect(browser.runtime.sendMessage).toBeCalled();

      const result = screen.getByText('abc bcd');
      expect(result).toBeInTheDocument();
    });
  });
});
