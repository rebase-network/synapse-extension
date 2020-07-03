import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { IntlProvider } from 'react-intl';
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
    useHistory: jest.fn(),
    Link: 'a',
  };
});

describe('import privateKey page', () => {
  let tree;
  let container;
  let getByTestId;

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
    container = tree.container;
    getByTestId = tree.getByTestId;
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

    const keystore = container.querySelector('[name="keystore"]');
    const keystorePassword = container.querySelector('[name="keystorePassword"]');
    const userPassword = container.querySelector('[name="userPassword"]');

    expect(keystore).toBeEmpty();
    expect(keystorePassword).toBeEmpty();
    expect(userPassword).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(keystore, { target: { value: 'test keystore' } });
      fireEvent.change(keystorePassword, { target: { value: 'test keystorePassword 123456' } });
      fireEvent.change(userPassword, { target: { value: 'test userPassword 123456' } });
    });

    expect(container.querySelector('#form-keystore')).toHaveFormValues({
      keystore: 'test keystore',
      keystorePassword: 'test keystorePassword 123456',
      userPassword: 'test userPassword 123456',
    });
  });
});
