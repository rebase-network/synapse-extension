import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
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
    Link: 'a',
  };
});

describe('Manage UDTs page', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App />
          </Router>
        </IntlProvider>,
      );
    });
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

    await userEvent.type(typeHash, '0x123');

    expect(screen.getByRole('form')).toHaveFormValues({
      typeHash: '0x123',
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

  it('should create new udt', async () => {
    const name = screen.getByLabelText('UDT Name');
    await userEvent.type(name, 'simpleUDT');

    const typeHash = screen.getByLabelText('UDT Hash');
    await userEvent.type(typeHash, '0x123');

    const symbol = screen.getByLabelText('Symbol');
    await userEvent.type(symbol, 'UDT');

    expect(screen.getByRole('form')).toHaveFormValues({
      decimal: '8',
      name: 'simpleUDT',
      typeHash: '0x123',
      symbol: 'UDT',
    });

    const submitBtn = screen.getByRole('button', { name: /Add/i });
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
      const udtsElem = screen.getAllByText(/simpleUDT/i);
      expect(udtsElem).toHaveLength(1);
    });
  });

  it('should delete', async () => {
    const udtsElem = screen.getAllByText(/simpleUDT/i);
    expect(udtsElem).toHaveLength(1);
    const result = screen.getAllByLabelText('delete');
    expect(result).toHaveLength(1);

    userEvent.click(result[0]);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });
});
