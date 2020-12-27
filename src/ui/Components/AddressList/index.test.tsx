import React from 'react';
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { MESSAGE_TYPE } from '@src/common/utils/constants';
import fixtures from './fixtures/addressesList';
import App from './index';

const AddressListItem = (props: any) => {
  return (
    <>
      <nav>Address List</nav>
    </>
  );
};

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
  beforeEach(async () => {
    const onSelectAddress = jest.fn();
    await act(async () => {
      await browser.storage.local.set({
        addressesList: fixtures.addressesList,
        currentNetwork: fixtures.currentNetwork,
      });
      render(
        <IntlProvider locale="en" messages={en}>
          <Router>
            <App onSelectAddress={onSelectAddress} AddressListItem={AddressListItem} />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should render address list', async () => {
    const items = screen.getAllByRole('navigation', { name: 'Address List' });
    expect(items).toHaveLength(4);
  });
});
