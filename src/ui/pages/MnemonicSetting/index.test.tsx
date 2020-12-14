import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
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

describe('Mnemonic Setting page', () => {
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

  it('should render Import / Generate btn', () => {
    const importBtn = screen.getByRole('button', { name: 'Import Mnemonic' });
    const generateBtn = screen.getByRole('button', { name: 'Generate Mnemonic' });
    expect(importBtn).toBeInTheDocument();
    expect(generateBtn).toBeInTheDocument();
  });

  it('should go to import mnenomic page', () => {
    const importBtn = screen.getByRole('button', { name: 'Import Mnemonic' });
    userEvent.click(importBtn);
    expect(history.push).toBeCalled();
  });

  it('should go to import mnenomic page', () => {
    const generateBtn = screen.getByRole('button', { name: 'Generate Mnemonic' });
    userEvent.click(generateBtn);
    expect(history.push).toBeCalled();
    expect(browser.runtime.sendMessage).toBeCalled();
  });
});
