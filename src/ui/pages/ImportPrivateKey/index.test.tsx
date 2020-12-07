import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
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
    Link: 'a',
  };
});

describe('import privateKey page', () => {
  let tree;

  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(() => {
    tree = render(
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
    const radio = screen.getByLabelText('Private Key');
    expect(radio).toBeInTheDocument();

    fireEvent.change(radio, { target: { value: '1', checked: true } });
    expect(radio).toBeChecked();
  });

  it('should change radio form fields: keystore', async () => {
    const radio = screen.getByLabelText('Keystore');
    expect(radio).toBeInTheDocument();

    fireEvent.change(radio, { target: { value: '1', checked: true } });
    expect(radio).toBeChecked();
  });

  it('should change privateKey form fields', async () => {
    const { getByTestId, container } = tree;

    const privateKey = container.querySelector('[name="privateKey"]');
    const password = container.querySelector('[name="password"]');

    expect(privateKey).toBeEmpty();
    expect(password).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(privateKey, {
        target: {
          value: 'test 0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
        },
      });
      fireEvent.change(password, { target: { value: 'test 123456' } });
    });

    expect(container.querySelector('#form-privateKey')).toHaveFormValues({
      privateKey: 'test 0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
      password: 'test 123456',
    });
  });

  it('should change keystore form fields', async () => {
    const { getByTestId, container } = tree;

    const keystorePassword = container.querySelector('[name="keystorePassword"]');
    const userPassword = container.querySelector('[name="userPassword"]');

    expect(keystorePassword).toBeEmpty();
    expect(userPassword).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(keystorePassword, { target: { value: 'test keystorePassword 123456' } });
      fireEvent.change(userPassword, { target: { value: 'test userPassword 123456' } });
    });

    expect(container.querySelector('#form-keystore')).toHaveFormValues({
      keystorePassword: 'test keystorePassword 123456',
      userPassword: 'test userPassword 123456',
    });
  });

  it('submit import private key', async () => {
    const submitBtns = screen.getAllByText('Import');
    expect(submitBtns).toHaveLength(2);
  });
});
