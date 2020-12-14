import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import userEvent from '@testing-library/user-event';
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

describe('import privateKey page', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('send message err', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        message: 'Private Key',
        type: MESSAGE_TYPE.IMPORT_KEYSTORE_ERR,
      });
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });

  it('send message ok', async () => {
    browser.runtime.sendMessage({
      message: 'Private Key',
      type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY_OK,
    });
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });

  it('should change radio form fields: private key', async () => {
    const radio = screen.getByRole('radio', { name: 'Private Key' });
    expect(radio).toBeInTheDocument();

    fireEvent.change(radio, { target: { value: '1', checked: true } });
    expect(radio).toBeChecked();
  });

  it('should change radio form fields: keystore', async () => {
    const radio = screen.getByRole('radio', { name: 'Keystore' });
    expect(radio).toBeInTheDocument();

    fireEvent.change(radio, { target: { value: '1', checked: true } });
    expect(radio).toBeChecked();
  });

  it('should change radio form fields: private key', async () => {
    const radio = screen.getByRole('radio', { name: 'Private Key' });
    expect(radio).toBeInTheDocument();

    fireEvent.change(radio, { target: { value: '1', checked: true } });
    expect(radio).toBeChecked();

    const radioKeystore = screen.getByRole('radio', { name: 'Keystore' });
    expect(radioKeystore).toBeInTheDocument();

    fireEvent.change(radioKeystore, { target: { value: '1', checked: true } });
    expect(radioKeystore).toBeChecked();
  });

  it('should be able to submit', async () => {
    const privateKey = screen.getByPlaceholderText('Private Key');
    const password = screen.getByLabelText('Password');
    //   const privateKey = container.querySelector('[name="privateKey"]');
    //   const password = container.querySelector('[name="password"]');

    await userEvent.type(privateKey, 'aaa');
    await userEvent.type(password, 'password_1');
    expect(screen.getByRole('form')).toHaveFormValues({
      privateKey: 'aaa',
      password: 'password_1',
    });

    const submitButton = screen.getByRole('button', { name: 'Import' });
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });

  it('submit import private key', async () => {
    const submitBtns = screen.getAllByText('Import');
    expect(submitBtns).toHaveLength(2);
  });
});
