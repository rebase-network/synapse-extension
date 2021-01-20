import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from '../List';

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

describe('List UDT', () => {
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
            <App />
          </Router>
        </IntlProvider>,
      );
    });
  });

  it('should delete', async () => {
    const udtsElem = screen.getAllByText(/simpleUDT/i);
    expect(udtsElem).toHaveLength(1);
    const result = screen.getAllByLabelText('delete');
    expect(result).toHaveLength(1);

    userEvent.click(result[0]);
    await waitFor(() => {
      expect(browser.storage.local.set).toBeCalled();
    });
  });
});
