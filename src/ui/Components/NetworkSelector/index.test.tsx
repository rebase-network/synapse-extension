import * as React from 'react';
import NetworkSelector from './index'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('React testing library', () => {
  let tree, container, getByTestId
  beforeEach(() => {
    tree = render(<NetworkSelector handleNetworkChange={null} />);
    container = tree.container
    getByTestId = tree.getByTestId
  });
  afterEach(cleanup)

  it('should render title', async() => {
    const elem = container.querySelector('#network-select')
    expect(container).toContainElement(elem)
    expect(elem).toHaveTextContent('Aggron')
  })
});

