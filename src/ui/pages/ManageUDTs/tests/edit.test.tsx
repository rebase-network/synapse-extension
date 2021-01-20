import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from '../Edit';

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

describe('Edit UDT', () => {
  const match = {
    params: {
      typeHash: '0x123',
    },
  };
  beforeEach(async () => {
    await browser.storage.local.set({
      udts: [
        {
          decimal: '8',
          name: 'simpleUDT',
          typeHash: '0x123',
          symbol: 'UDT',
        },
      ],
    });
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App match={match} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Confirm/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should create new udt', async () => {
    expect(screen.getByRole('form')).toHaveFormValues({
      decimal: '8',
      name: 'simpleUDT',
      typeHash: '0x123',
      symbol: 'UDT',
    });

    const name = screen.getByLabelText('UDT Name');
    await userEvent.type(name, '123');

    const typeHash = screen.getByLabelText('UDT Hash');
    await userEvent.type(typeHash, '123');

    const symbol = screen.getByLabelText('Symbol');
    await userEvent.type(symbol, '123');

    const decimal = screen.getByLabelText('Decimal');
    await userEvent.type(decimal, '123');

    expect(screen.getByRole('form')).toHaveFormValues({
      decimal: '8123',
      name: 'simpleUDT123',
      typeHash: '0x123123',
      symbol: 'UDT123',
    });

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });
});
