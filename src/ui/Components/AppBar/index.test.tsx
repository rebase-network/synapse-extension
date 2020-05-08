import * as React from 'react';
import AppBar from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('React testing library', () => {
  let tree, container, getByTestId;
  beforeEach(() => {
    tree = render(<AppBar handleNetworkChange={null} />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });
  afterEach(cleanup);

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
