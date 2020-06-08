import * as React from 'react';
import App from './index';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '../locales/en';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('setting page', () => {
  let tree, container, getByTestId;
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

  it('should render item: Export Mnemonic', async () => {
    const mnemonic = getByTestId('exportMnemonic');
    expect(mnemonic).toHaveTextContent('Export Mnemonic');
  });

  it('should render item: Export Private Key', async () => {
    const mnemonic = getByTestId('exportPrivateKey');
    expect(mnemonic).toHaveTextContent('Export Private Key / Keystore');
  });

  it('should render item: Import Private Key', async () => {
    const mnemonic = getByTestId('importPrivateKey');
    expect(mnemonic).toHaveTextContent('Import Private Key / Keystore');
  });
});
