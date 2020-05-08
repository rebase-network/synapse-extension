import * as React from 'react';
import App from '../../App';
import { render, fireEvent, waitFor, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';
import TxDetail from '.';

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
  let tree; let container; let getByTestId;
  beforeEach(() => {
    tree = render(<TxDetail />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const txDetailTitle = getByTestId('tx-detail-title');
    expect(container).toContainElement(txDetailTitle);
    expect(txDetailTitle).toHaveTextContent('Transaction Detail');
  });

  it('should render amount', async () => {
    const amount = screen.queryByTestId('amount');
    expect(container).toContainElement(amount);
    expect(amount).toHaveTextContent('0');
  });

  it('should render inputs', async () => {
    const inputs = screen.queryByTestId('inputs');
    expect(container).toContainElement(inputs);
    expect(inputs).toHaveTextContent('inputs');
  });

  it('should render outputs', async () => {
    const outputs = screen.queryByTestId('outputs');
    expect(container).toContainElement(outputs);
    // expect(outputs).toHaveTextContent("ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70")
    expect(outputs).toHaveTextContent('outputs');
  });

  it('should render TxHash', async () => {
    const txHash = screen.queryByTestId('txHash');
    expect(container).toContainElement(txHash);
    expect(txHash).toHaveTextContent('TxHash');
  });
});
