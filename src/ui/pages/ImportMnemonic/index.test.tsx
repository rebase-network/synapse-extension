import React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('import mnemonic page', () => {
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

  it('should render form fields: Mnemonic', async () => {
    const mnemonic = container.querySelector('[name="mnemonic"]');
    expect(container).toContainElement(mnemonic);
  });

  it('should render form fields: Password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(container).toContainElement(password);
  });

  it('should render form fields: Confirm Password', async () => {
    const confirmPassword = container.querySelector('[name="confirmPassword"]');
    expect(container).toContainElement(confirmPassword);
  });

  it('should change form fields: password', async () => {
    const mnemonic = container.querySelector('[name="mnemonic"]');
    const password = container.querySelector('[name="password"]');
    const confirmPassword = container.querySelector('[name="confirmPassword"]');

    expect(mnemonic).toBeEmpty();
    expect(password).toBeEmpty();
    expect(confirmPassword).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(mnemonic, { target: { value: 'test mnemonic' } });
      fireEvent.change(password, { target: { value: 'test password' } });
      fireEvent.change(confirmPassword, { target: { value: 'test password' } });
    });

    expect(container.querySelector('#form-mnemonic')).toHaveFormValues({
      mnemonic: 'test mnemonic',
      password: 'test password',
      confirmPassword: 'test password',
    });
  });
});
