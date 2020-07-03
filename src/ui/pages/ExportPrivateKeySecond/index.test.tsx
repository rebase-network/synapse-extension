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

describe('export privatekey second page', () => {
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

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const elemContainer = getByTestId('container');
    expect(container).toContainElement(elemContainer);
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const elemContainer = getByTestId('container');
    expect(container).toContainElement(elemContainer);
  });
});
