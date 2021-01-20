import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from '../Create';

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

describe('Create UDT', () => {
  const routeProps = {
    location: {
      search: '?typeHash=0x123',
    },
  };

  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App routeProps={routeProps} />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Confirm/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should create new udt', async () => {
    const name = screen.getByLabelText('UDT Name');
    await userEvent.type(name, 'simpleUDT');

    const symbol = screen.getByLabelText('Symbol');
    await userEvent.type(symbol, 'UDT');

    expect(screen.getByRole('form')).toHaveFormValues({
      decimal: '8',
      name: 'simpleUDT',
      typeHash: '0x123',
      symbol: 'UDT',
    });

    const submitBtn = screen.getByRole('button', { name: /Confirm/i });
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });
});
