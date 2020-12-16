import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
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

describe('modal component', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App open>
            <div>Modal Title</div>
          </App>
        </Router>
      </IntlProvider>,
    );
  });

  it('should render title', async () => {
    const english = screen.getByText('Modal Title');
    expect(english).toBeInTheDocument();
  });
});
