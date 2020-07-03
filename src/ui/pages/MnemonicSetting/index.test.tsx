import React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';

describe('Mnemonic Setting page', () => {
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

  it('should render Import / Generate btn', () => {
    const btn1 = getByTestId('import-button');
    const btn2 = getByTestId('generate-button');
    expect(container).toContainElement(btn1);
    expect(container).toContainElement(btn2);
  });
});
