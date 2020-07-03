import React from 'react';
import App from './index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@src/common/locales/en';

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
    const submitButton = screen.getByRole('button', { name: /Add/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should change form fields: name', async () => {
    const name = screen.getByLabelText('Name');

    expect(name).toBeInTheDocument();
    expect(name).toBeEmpty();

    await userEvent.type(name, 'syuukawa');

    expect(screen.getByRole('form')).toHaveFormValues({
      name: 'syuukawa',
    });
  });

  it('should change form fields: address', async () => {
    const address = screen.getByLabelText('Address');

    expect(address).toBeInTheDocument();
    expect(address).toBeEmpty();

    await userEvent.type(address, 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae');

    expect(screen.getByRole('form')).toHaveFormValues({
      address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    });
  });
});
