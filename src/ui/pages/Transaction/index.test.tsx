import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  render,
  screen,
  waitFor,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@src/common/locales/en';
import NetworkManager from '@common/networkManager';
import { aliceAddresses } from '@src/tests/fixture/address';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import currentWallet from './fixtures/currentWallet';
import contacts from './fixtures/contacts';
import App from './index';

jest.mock('@src/common/utils/apis');

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
    await browser.storage.local.set({ currentWallet, contacts });
    await NetworkManager.initNetworks();
    delete (window as any).location;
    (window as any).location = {};
    window.location.search = `?to=${aliceAddresses.anyPay.address}`;
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

  it('should change form fields: Capacity is 1', async () => {
    const capacity = screen.getByLabelText('Capacity');

    expect(capacity).toBeInTheDocument();
    expect(capacity).toBeEmpty();

    await userEvent.type(capacity, '1');
    expect(screen.getByRole('form')).toHaveFormValues({
      capacity: '1',
    });
  });

  it('should change form fields: Capacity is 61', async () => {
    const capacity = screen.getByLabelText('Capacity');

    expect(capacity).toBeInTheDocument();
    expect(capacity).toBeEmpty();

    await userEvent.type(capacity, '61');
    expect(screen.getByRole('form')).toHaveFormValues({
      capacity: '61',
    });
  });

  it('should change form fields: Capacity is 200', async () => {
    const capacity = screen.getByLabelText('Capacity');

    expect(capacity).toBeInTheDocument();
    expect(capacity).toBeEmpty();

    await userEvent.type(capacity, '200');
    expect(screen.getByRole('form')).toHaveFormValues({
      capacity: '200',
    });
  });

  it('should change form fields: Fee Rate', async () => {
    const feeRate = screen.getByText('2000');
    expect(feeRate).toBeInTheDocument();
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
      fee: '0.00004096',
      data: '0x01',
    });

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(chrome.runtime.sendMessage).toBeCalled();
    });
  });

  it('send tx successfully', async () => {
    act(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.SEND_TX_OVER,
        success: true,
        hash: '0x123',
        message: 'TX is sent',
        data: {
          tx: {
            hash: '0x123',
          },
        },
      });
    });
    expect(screen.getByText('0x123')).toBeInTheDocument();
  });

  it('send tx over with error', async () => {
    act(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.SEND_TX_OVER,
        success: false,
        hash: '',
        data: {
          tx: {
            hash: '',
          },
        },
      });
    });
    expect(
      screen.getByText('The transaction failed to send, please try again later'),
    ).toBeInTheDocument();
  });

  it('send tx error', async () => {
    act(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.SEND_TX_ERROR,
        success: false,
        hash: '',
        message: 'TX failed to send',
        data: {
          tx: {
            hash: '',
          },
        },
      });
    });

    expect(screen.getByText('TX failed to send')).toBeInTheDocument();
  });
});
