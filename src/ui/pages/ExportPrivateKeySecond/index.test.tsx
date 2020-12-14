import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import en from '@common/locales/en';
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
  };
});

browser.downloads = {
  ...browser.downloads,
  download: mockFunc,
};

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
    const result = screen.getByText('Export Private Key / Keystore');
    expect(result).toBeInTheDocument();
  });

  it('should change radio form fields: private key', async () => {
    const radio = screen.getByLabelText('Private Key');
    expect(radio).toBeInTheDocument();

    userEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it('should change radio form fields: Keystore', async () => {
    const radio = screen.getByLabelText('Keystore');
    expect(radio).toBeInTheDocument();

    userEvent.click(radio);
    expect(radio).toBeChecked();

    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT,
        keystore: 'keystore',
      });
      expect(browser.runtime.sendMessage).toBeCalled();
    });

    const submitButton = screen.getByRole('button', { name: /Save Keystore/i });
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.downloads.download).toBeCalled();
    });
  });
});
