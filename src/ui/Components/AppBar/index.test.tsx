import * as React from 'react';
import App from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';
import { IntlProvider } from 'react-intl';
import en from '../../pages/locales/en';

describe('React testing library', () => {
  let tree, container, getByTestId;

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

  it('should render title', () => {
    const elem = container.querySelector('h6');
    expect(container).toContainElement(elem);
    expect(elem).toHaveTextContent('Synapse');
  });

  it('should render setting icon on left side', () => {
    const elem = getByTestId('setting-icon');
    expect(elem).not.toBeNull();
  });
});
