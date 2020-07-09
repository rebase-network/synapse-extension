import React from 'react';
import { render } from '@testing-library/react';
import NetworkSelector from './index';
import '@testing-library/jest-dom/extend-expect';

describe('React testing library', () => {
  let tree;
  let container;
  beforeEach(() => {
    tree = render(<NetworkSelector handleNetworkChange={null} />);
    container = tree.container;
  });

  it('should render title', async () => {
    const elem = container.querySelector('#network-select');
    expect(container).toContainElement(elem);
  });
});
