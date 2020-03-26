import * as React from 'react';
import { MemoryRouter } from 'react-router-dom'
import App from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('React testing library', () => {
  let tree
  beforeEach(() => {
    tree = render(
      <MemoryRouter initialEntries = {['/address']}>
        <App />
     </MemoryRouter>
    );
  });
  afterEach(cleanup)

  it('should render title', async() => {
    const {
      getByTestId,
      container
    } = tree

    const title = getByTestId('address-title')
    expect(container).toContainElement(title)
    expect(title).toHaveTextContent('Address')
  })
});

