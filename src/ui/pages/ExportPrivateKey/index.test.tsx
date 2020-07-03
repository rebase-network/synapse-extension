import React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
    Link: 'a',
  };
});

describe('export privatekey page', () => {
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
  });

  it('should render form fields: Password', () => {
    const password = container.querySelector('[name="password"]');
    expect(container).toContainElement(password);
  });

  it('should render form fields: submitbutton', () => {
    // const submitButton = container.querySelector('[type="submit"]');
    const submitButton = getByTestId('submit-button');
    expect(container).toContainElement(submitButton);
  });

  it('should change form fields: password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(password).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(password, { target: { value: 'test password' } });
    });

    expect(container.querySelector('#export-private-key')).toHaveFormValues({
      password: 'test password',
    });
  });
});
