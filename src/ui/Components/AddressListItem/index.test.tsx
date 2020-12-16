import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import addressInfo from './fixtures/addressInfo';
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

describe('address list component', () => {
  const history = useHistory();
  beforeEach(async () => {
    const onSelectAddress = jest.fn();
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App onSelectAddress={onSelectAddress} addressInfo={addressInfo} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render address info', async () => {
    const elem = screen.getByText('Secp256k1');
    expect(elem).toBeInTheDocument();

    userEvent.click(elem);
    expect(browser.storage.local.set).toBeCalled();
    expect(history.push).toBeCalled();
  });
});
