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

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /confirm/i });
    expect(submitButton).toBeInTheDocument();

    const password = screen.getByLabelText('Password');
    await userEvent.type(password, 'test password');
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });

  it('should change form fields: password', async () => {
    const password = screen.getByLabelText('Password');

    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(screen.getByRole('form')).toHaveFormValues({
      password: 'test password',
    });
  });

  it('send message 1', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
        isValidatePassword: true,
        isValidateEntropy: true,
      });
      expect(browser.runtime.sendMessage).toBeCalled();
      const result = screen.getByText('Export Mnemonic');
      expect(result).toBeInTheDocument();
    });
  });

  it('send message 2', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
        isValidatePassword: false,
        isValidateEntropy: true,
      });
      const result = screen.getByText(/Invalid password/i);
      expect(result).toBeInTheDocument();
    });
  });

  it('send message 3', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_MNEONIC_CHECK_RESULT,
        isValidatePassword: true,
        isValidateEntropy: false,
      });
      const result = screen.getByText(/Can not export Mnemonic/i);
      expect(result).toBeInTheDocument();
    });
  });
});
