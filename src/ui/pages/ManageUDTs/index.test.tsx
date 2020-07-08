import React from 'react';
import App from './index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('Manage UDTs page', () => {
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
    const name = screen.getByLabelText('UDT Name');

    expect(name).toBeInTheDocument();
    expect(name).toBeEmpty();

    await userEvent.type(name, 'simpleUDT');

    expect(screen.getByRole('form')).toHaveFormValues({
      name: 'simpleUDT',
    });
  });

  it('should change form fields: typeHash', async () => {
    const typeHash = screen.getByLabelText('UDT Hash');

    expect(typeHash).toBeInTheDocument();
    expect(typeHash).toBeEmpty();

    await userEvent.type(
      typeHash,
      '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    );

    expect(screen.getByRole('form')).toHaveFormValues({
      typeHash: '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
    });
  });

  it('should change form fields: symbol', async () => {
    const symbol = screen.getByLabelText('Symbol');

    expect(symbol).toBeInTheDocument();
    expect(symbol).toBeEmpty();

    await userEvent.type(symbol, 'UDT');

    expect(screen.getByRole('form')).toHaveFormValues({
      symbol: 'UDT',
    });
  });

  it('should change form fields: decimals', async () => {
    const decimal = screen.getByLabelText('Decimal');

    expect(decimal).toBeInTheDocument();

    expect(screen.getByRole('form')).toHaveFormValues({
      decimal: '8',
    });
  });
});
