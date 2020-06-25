import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import chrome from 'sinon-chrome';
import TxDetail from './index';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '../../pages/locales/en';
import { tx } from './fixture';

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

describe('txDetail page', () => {
  let container, getByTestId;
  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(() => {
    const tree = render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <TxDetail data={tx} />
        </Router>
      </IntlProvider>,
    );

    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  it('should render amount', async () => {
    const amount = getByTestId('amount');
    expect(container).toContainElement(amount);
    expect(amount).toHaveTextContent((tx.amount / 10 ** 8).toString());
  });

  it.skip('should render inputs', async () => {
    const inputs = getByTestId('inputs');
    expect(container).toContainElement(inputs);
    expect(inputs).toHaveTextContent('inputs');
  });

  it.skip('should render outputs', async () => {
    const outputs = getByTestId('outputs');
    expect(container).toContainElement(outputs);
    // expect(outputs).toHaveTextContent("ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70")
    expect(outputs).toHaveTextContent('outputs');
  });

  it('should render TxHash', async () => {
    const txHash = getByTestId('txHash');
    expect(container).toContainElement(txHash);
    expect(txHash).toHaveTextContent('Tx Hash');
  });
});
