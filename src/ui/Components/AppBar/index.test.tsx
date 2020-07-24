import React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';

describe('React testing library', () => {
  let tree;
  let container;
  let getByTestId;

  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(() => {
    tree = render(
      <IntlProvider locale="en" messages={en}>
        <App handleNetworkChange={null} />
      </IntlProvider>,
    );
    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  it('should render logo', () => {
    const elem = container.querySelector('img');
    expect(container).toContainElement(elem);
  });

  it('should render setting icon on left side', () => {
    const elem = getByTestId('setting-icon');
    expect(elem).not.toBeNull();
  });
});
