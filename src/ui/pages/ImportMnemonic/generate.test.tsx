import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import userEvent from '@testing-library/user-event';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import App from './generate';

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
  };
});

describe('generate mnemonic page', () => {
  const history = useHistory();

  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render title', () => {
    const result = screen.getByText('Generate Mnemonic');
    expect(result).toBeInTheDocument();
  });

  it('should change form fields: mnemonic', async () => {
    const mnemonic = screen.getByLabelText('Mnemonic(Only Support 12 Words)');

    expect(mnemonic).toBeInTheDocument();
    expect(mnemonic).toBeEmpty();

    await userEvent.type(mnemonic, 'aaa');

    expect(screen.getByRole('form')).toHaveFormValues({
      mnemonic: 'aaa',
    });
  });

  it('should change form fields: password', async () => {
    const password = screen.getByLabelText('Password (min 6 chars)');

    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(screen.getByRole('form')).toHaveFormValues({
      password: 'test password',
    });
  });

  it('should change form fields: confirmPassword', async () => {
    const password = screen.getByLabelText('Confirm Password');

    expect(password).toBeInTheDocument();
    expect(password).toBeEmpty();

    await userEvent.type(password, 'test password');

    expect(screen.getByRole('form')).toHaveFormValues({
      confirmPassword: 'test password',
    });
  });

  it('should not submit due to wrong password', async () => {
    const password = screen.getByLabelText('Password (min 6 chars)');
    const passwordConfirm = screen.getByLabelText('Confirm Password');
    const mnemonic = screen.getByLabelText('Mnemonic(Only Support 12 Words)');

    await userEvent.type(mnemonic, 'aaa');
    await userEvent.type(password, 'password_1');
    await userEvent.type(passwordConfirm, 'password_2');
    expect(screen.getByRole('form')).toHaveFormValues({
      mnemonic: 'aaa',
      password: 'password_1',
      confirmPassword: 'password_2',
    });

    const submitButton = screen.getByRole('button', { name: 'Create' });
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).not.toBeCalled();
    });

    expect(screen.getByText("Passwords don't match!")).toBeInTheDocument();
  });

  it('should be able to submit', async () => {
    const password = screen.getByLabelText('Password (min 6 chars)');
    const passwordConfirm = screen.getByLabelText('Confirm Password');
    const mnemonic = screen.getByLabelText('Mnemonic(Only Support 12 Words)');

    await userEvent.type(mnemonic, 'aaa');
    await userEvent.type(password, 'password_1');
    await userEvent.type(passwordConfirm, 'password_1');
    expect(screen.getByRole('form')).toHaveFormValues({
      mnemonic: 'aaa',
      password: 'password_1',
      confirmPassword: 'password_1',
    });

    const submitButton = screen.getByRole('button', { name: 'Create' });
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });

  it('send validate message: RECE_MNEMONIC', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({ type: MESSAGE_TYPE.RECE_MNEMONIC, mnemonic: 'abc' });
      expect(browser.runtime.sendMessage).toBeCalled();
      expect(screen.getByRole('form')).toHaveFormValues({
        mnemonic: 'abc',
      });
    });
  });

  it('send validate message: VALIDATE_PASS', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS);
      expect(browser.runtime.sendMessage).toBeCalled();
      expect(history.push).toBeCalled();
    });
  });
});
