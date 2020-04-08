import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  screen
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';

describe('React testing tx-detail', () => {
  let tree;
  beforeEach(() => {
    tree = render(
      <MemoryRouter initialEntries={['/tx-detail']}>
        <App />
      </MemoryRouter>
    );
  });
  afterEach(cleanup);

  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const txDetailTitle = getByTestId('tx-detail-title');
    expect(container).toContainElement(txDetailTitle);
    expect(txDetailTitle).toHaveTextContent('Transaction Detail');
  });



});
