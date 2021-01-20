import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from '../index';

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

describe('Manage UDTs page', () => {
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

  it('should render title', async () => {
    const title = screen.getByText(/Manage UDTs/i);
    expect(title).toBeInTheDocument();
  });
  it('should render add button', async () => {
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
