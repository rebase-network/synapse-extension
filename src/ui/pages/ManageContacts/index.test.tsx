import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import App from '@ui/pages/ManageContacts/index';
import chrome from 'sinon-chrome';
import en from '@ui/pages/locales/en';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('export mnemonic page', () => {
  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render form fields: submitbutton', async () => {});
});
