import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
// import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@src/common/locales/en';
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

describe('Send Transaction page', () => {
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
  it('should render title', () => {
    const result = screen.getByText('Send Transaction');
    expect(result).toBeInTheDocument();
  });

  it('should change form fields: To', async () => {
    const address = screen.getByLabelText('To');

    expect(address).toBeInTheDocument();

    await userEvent.type(address, 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae');

    expect(screen.getByRole('form')).toHaveFormValues({
      address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    });
  });

  it('should change form fields: Capacity', async () => {
    const capacity = screen.getByLabelText('Capacity');

    expect(capacity).toBeInTheDocument();
    expect(capacity).toBeEmpty();

    await userEvent.type(capacity, '61');

    expect(screen.getByRole('form')).toHaveFormValues({
      capacity: '61',
    });
  });

  it('should change form fields: Fee', async () => {
    const fee = screen.getByLabelText('Fee');
    const expected = '0.00001';

    expect(fee).toBeInTheDocument();
    expect(fee).toBeEmpty();

    await userEvent.type(fee, expected);

    expect(screen.getByRole('form')).toHaveFormValues({
      fee: expected,
    });
  });

  it('should change form fields: Data', async () => {
    const data = screen.getByLabelText('Data');
    const expected = '0x01';
    expect(data).toBeInTheDocument();
    expect(data).toBeEmpty();

    await userEvent.type(data, expected);

    expect(screen.getByRole('form')).toHaveFormValues({
      data: expected,
    });
  });

  it('should change form fields: Password', async () => {
    const password = screen.getByLabelText('Password');
    const expected = '111111';
    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, expected);

    expect(screen.getByRole('form')).toHaveFormValues({
      password: expected,
    });
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Send/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should submit form', async () => {
    const address = screen.getByLabelText('To');
    const capacity = screen.getByLabelText('Capacity');
    const password = screen.getByLabelText('Password');
    const fee = screen.getByLabelText('Fee');
    const data = screen.getByLabelText('Data');
    const submitButton = screen.getByRole('button', { name: /Send/i });

    await userEvent.type(address, 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae');
    await userEvent.type(capacity, '61');
    await userEvent.type(password, '111111');
    await userEvent.type(fee, '0.00001');
    await userEvent.type(data, '0x01');

    expect(screen.getByRole('form')).toHaveFormValues({
      address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
      capacity: '61',
      password: '111111',
      fee: '0.00001',
      data: '0x01',
    });

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(chrome.runtime.sendMessage).toBeCalled();
    });
  });
});
