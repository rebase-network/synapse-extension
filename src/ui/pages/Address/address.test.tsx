import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from './Address';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: () => ({
      push: jest.fn(),
    }),
  };
});

jest.mock('@ui/Components/TokenList');

describe('Address page', () => {
  let tree;
  let container;
  let getByTestId;
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

    window.chrome = chrome;
  });

  it('should render address', async () => {
    const address = getByTestId('address-info');
    expect(container).toContainElement(address);
    expect(address).toHaveTextContent(/ck|loading|null|undefined|/);
  });

  it('should render capacity', () => {
    const capacity = getByTestId('capacity');
    expect(capacity).toHaveTextContent('Loading...');
  });

  it('should render receive / send btn', () => {
    const receiveBtn = getByTestId('receive');
    const sendBtn = getByTestId('send');
    expect(container).toContainElement(receiveBtn);
    expect(container).toContainElement(sendBtn);
  });

  it('should render capacity refresh button', () => {
    const result = screen.getByRole('button', { name: /CKB|\.\.\./i });
    expect(result).toBeInTheDocument();
  });

  it('should render tx list', () => {
    const result = screen.getByText('Latest 20 Transactions');
    expect(result).toBeInTheDocument();
  });

  it('should render Show UDT button', async () => {
    const result = screen.getByText('Show UDT');
    expect(result).toBeInTheDocument();
    userEvent.click(result);
    expect(screen.getByText('Hide UDT')).toBeInTheDocument();
  });
});
