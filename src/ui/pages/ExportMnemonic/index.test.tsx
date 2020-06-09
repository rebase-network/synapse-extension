import * as React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '../locales/en';

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

describe('export mnemonic page', () => {
  let tree, container, getByTestId;

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

  it('should render form fields: Password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(container).toContainElement(password);
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = getByTestId('submit-button');
    expect(container).toContainElement(submitButton);
  });

  it('should change form fields: password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(container.querySelector('#export-mnemonic-key')).toHaveFormValues({
      password: 'test password',
    });
  });
});
