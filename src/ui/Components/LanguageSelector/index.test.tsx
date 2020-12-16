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

describe('address list component', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render menu', async () => {
    delete (window as any).location;
    (window as any).location = { replace: jest.fn() };
    const english = screen.getByText('English');
    expect(english).toBeInTheDocument();

    userEvent.click(english);
    const cn = screen.getByText('中文');
    expect(cn).toBeInTheDocument();

    userEvent.click(cn);
    const englishAfter = screen.getByText('English');
    expect(englishAfter).toBeInTheDocument();

    const cnAfter = screen.getAllByText('中文');
    expect(cnAfter).toHaveLength(2);
  });
});
