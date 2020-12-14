import React from 'react';
import { act, render, screen, waitFor, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import App from '@ui/pages/Setting';
import en from '@common/locales/en';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

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

describe('setting page', () => {
  const history = useHistory();

  beforeEach(async () => {
    localStorage.setItem('IS_LOGIN', 'YES');
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

  it('should render item: Export Mnemonic', async () => {
    const element = screen.getByText('Export Mnemonic');

    expect(element).toBeInTheDocument();
  });

  it('should render item: Export Private Key', async () => {
    const element = screen.getByText('Export Private Key / Keystore');

    expect(element).toBeInTheDocument();
  });

  it('should render item: Import Private Key', async () => {
    const element = screen.getByText('Import Private Key / Keystore');

    expect(element).toBeInTheDocument();
  });

  it('should render item: Manage Contacts', async () => {
    const element = screen.getByText('Manage Contacts');

    expect(element).toBeInTheDocument();
  });

  it('should render item: Manage UDTs', async () => {
    const element = screen.getByText('Manage UDTs');

    expect(element).toBeInTheDocument();
  });

  it('should render item: Manage Networks', async () => {
    const element = screen.getByText('Manage Networks');

    expect(element).toBeInTheDocument();
  });

  it('should render item: English', async () => {
    const element = screen.getByText('English');

    expect(element).toBeInTheDocument();
  });

  it('should render delete wallet form and submit', async () => {
    const deletBtn = screen.getByText(/delete wallet/i);
    expect(deletBtn).toBeInTheDocument();
    userEvent.click(deletBtn);

    const password = await screen.findByLabelText('Password');
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

    // browser.runtime.sendMessage({
    //   type: MESSAGE_TYPE.DELETE_WALLET_ERR,
    // });
    // const incorrectPwd = await screen.findByText('Incorrect Password');
    // expect(incorrectPwd).toBeInTheDocument();
    // await waitFor(() => {
    //   const incorrectPwd = screen.getByText('Incorrect Password');
    //   expect(incorrectPwd).toBeInTheDocument();
    // });

    // browser.runtime.sendMessage({
    //   type: MESSAGE_TYPE.DELETE_WALLET_OK,
    // });
    // expect(browser.runtime.sendMessage).toBeCalled();
    // await waitFor(() => {
    // expect(history.push).toBeCalled();
    // expect(history.push).toBeCalledWith('./mnemonic-setting');
    // });
  });
});
