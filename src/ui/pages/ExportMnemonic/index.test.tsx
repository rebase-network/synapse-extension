import * as React from 'react';
import App from './index';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
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
  beforeAll(() => {
    window.chrome = chrome;
  });

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
  });

  it('should change form fields: password', async () => {
    const password = screen.getByLabelText('Password');
    screen.debug(password);

    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(screen.getByRole('form')).toHaveFormValues({
      password: 'test password',
    });
  });
});
