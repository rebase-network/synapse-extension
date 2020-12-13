import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import NetworkManager from '@common/networkManager';
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

describe('Manage networks page', () => {
  beforeEach(async () => {
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

  it('should get form fields value: title', async () => {
    const title = screen.getByLabelText('Network Name');
    const expectedValue = 'Mainnet';

    expect(title).toBeInTheDocument();
    expect(title).toBeEmpty();

    await userEvent.type(title, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      title: expectedValue,
    });
  });

  it('should change form fields: nodeURL', async () => {
    const nodeURL = screen.getByLabelText('CKB Node URL');
    const expectedValue = 'https://rpc.mainnet.com';

    expect(nodeURL).toBeInTheDocument();
    expect(nodeURL).toBeEmpty();

    await userEvent.type(nodeURL, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      nodeURL: expectedValue,
    });
  });

  it('should change form fields: cacheURL', async () => {
    const cacheURL = screen.getByLabelText('CKB Cache Layer URL');
    const expectedValue = 'https://cache.mainnet.com';

    expect(cacheURL).toBeInTheDocument();
    expect(cacheURL).toBeEmpty();

    await userEvent.type(cacheURL, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      cacheURL: expectedValue,
    });
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Add/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should create new network', async () => {
    const title = screen.getByLabelText('Network Name');
    const expectedTitle = 'Mainnet-abc';

    const nodeURL = screen.getByLabelText('CKB Node URL');
    const expectedNodeUrl = 'https://rpc-abc.mainnet.com';

    const cacheURL = screen.getByLabelText('CKB Cache Layer URL');
    const expectedCacheURL = 'https://cache-abc.mainnet.com';

    const submitBtn = screen.getByRole('button', { name: 'Add' });

    await userEvent.type(title, expectedTitle);
    await userEvent.type(nodeURL, expectedNodeUrl);
    await userEvent.type(cacheURL, expectedCacheURL);

    expect(screen.getByRole('form')).toHaveFormValues({
      title: expectedTitle,
      nodeURL: expectedNodeUrl,
      cacheURL: expectedCacheURL,
    });

    const networkListBefore = await NetworkManager.getNetworkList();

    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(networkListBefore.length).toEqual(0);
    });
    const networkListAfter = await NetworkManager.getNetworkList();
    expect(networkListAfter.length).toEqual(networkListBefore.length + 1);
  });

  it('should delete', async () => {
    await NetworkManager.initNetworks();
    const networkListBefore = await NetworkManager.getNetworkList();
    expect(networkListBefore.length).toEqual(3);
    const aliceElems = screen.getAllByText('Mainnet');
    expect(aliceElems).toHaveLength(1);
    const result = screen.getAllByLabelText('delete');
    expect(result).toHaveLength(1);

    userEvent.click(result[0]);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });
});
