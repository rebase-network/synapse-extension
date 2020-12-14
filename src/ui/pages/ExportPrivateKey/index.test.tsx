import React from 'react';
import { useHistory, BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import en from '@common/locales/en';
import userEvent from '@testing-library/user-event';
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

describe('export privatekey page', () => {
  let tree;
  let container;
  let getByTestId;
  const history = useHistory();

  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(() => {
    tree = render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  it('should render title', () => {
    const result = screen.getByText('Export Private Key / Keystore');
    expect(result).toBeInTheDocument();
  });

  it('should render form fields: Password', () => {
    const password = container.querySelector('[name="password"]');
    expect(container).toContainElement(password);
  });

  it('should render form fields: submitbutton', () => {
    // const submitButton = container.querySelector('[type="submit"]');
    const submitButton = getByTestId('submit-button');
    expect(container).toContainElement(submitButton);
  });

  it('should change form fields: password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(password).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(password, { target: { value: 'test password' } });
    });

    expect(container.querySelector('#export-private-key')).toHaveFormValues({
      password: 'test password',
    });
  });

  it('send message password is correct', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        isValidatePassword: true,
      });
      expect(browser.runtime.sendMessage).toBeCalled();
      expect(history.push).toBeCalled();
    });
  });

  it('send message password is wrong', async () => {
    await waitFor(() => {
      browser.runtime.sendMessage({
        type: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT,
        isValidatePassword: false,
      });
      const result = screen.getByText('Invalid Password');
      expect(result).toBeInTheDocument();
    });
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

  it('submit', async () => {
    const btn = screen.getByRole('button', { name: 'Confirm' });
    expect(btn).toBeInTheDocument();

    const password = screen.getByLabelText('Password');

    await userEvent.type(password, 'test password');

    userEvent.click(btn);
    await waitFor(() => {
      expect(browser.runtime.sendMessage).toBeCalled();
    });
  });
});
