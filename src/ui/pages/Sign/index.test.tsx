import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import App from './Component';

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

describe('sign/auth page', () => {
  const RawTxDetail = () => <div>RawTxDetail</div>;
  const message = {
    type: MESSAGE_TYPE.EXTERNAL_SIGN,
    data: { tx: { version: '0x0' } },
  };
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App RawTxDetail={RawTxDetail} message={message} />
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

    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(screen.getByRole('form')).toHaveFormValues({
      password: 'test password',
    });
  });

  it('should submit', async () => {
    const password = screen.getByLabelText('Password');
    await userEvent.type(password, 'password_1');
    expect(screen.getByRole('form')).toHaveFormValues({
      password: 'password_1',
    });
    const confirmBtn = screen.getByText('Confirm');
    expect(confirmBtn).toBeInTheDocument();
    userEvent.click(confirmBtn);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });
});
