import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
// import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@src/common/locales/en';
import { addressToScript } from '@keyper/specs';
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

describe('export mnemonic page', () => {
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
    const result = screen.getByText('Manage Contacts');
    expect(result).toBeInTheDocument();
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Add/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should change form fields: name', async () => {
    const name = screen.getByLabelText('Name');

    expect(name).toBeInTheDocument();
    expect(name).toBeEmpty();

    await userEvent.type(name, 'Alice');

    expect(screen.getByRole('form')).toHaveFormValues({
      name: 'Alice',
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

  it('should submit form', async () => {
    const name = screen.getByLabelText('Name');
    const address = screen.getByLabelText('Address');
    const submitButton = screen.getByRole('button', { name: /Add/i });
    await userEvent.type(name, 'Alice');
    await userEvent.type(address, 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae');

    expect(screen.getByRole('form')).toHaveFormValues({
      name: 'Alice',
      address: 'ckt1qyqfhpyg02ew59cfnr8lnz2kwhwd98xjd4xsscxlae',
    });

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });

    await userEvent.type(name, 'Alice');
    await userEvent.type(address, 'aaa');

    expect(screen.getByRole('form')).toHaveFormValues({
      name: 'Alice',
      address: 'aaa',
    });

    userEvent.click(submitButton);
    expect(addressToScript).toThrow();

    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });

  it('should render existing contacts', async () => {
    await waitFor(() => {
      const result = screen.getByText('Alice');
      expect(result).toBeInTheDocument();
    });
  });

  it('should delete', async () => {
    const result = screen.getAllByLabelText('delete');
    expect(result).toHaveLength(1);

    const aliceElems = screen.getAllByText('Alice');
    expect(aliceElems).toHaveLength(1);

    userEvent.click(result[0]);
    expect(browser.storage.local.set).toBeCalled();
  });
});
