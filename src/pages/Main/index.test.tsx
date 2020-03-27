import * as React from 'react';
import { MemoryRouter } from 'react-router-dom'
import App from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import * as chrome from "sinon-chrome";

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

  beforeAll(() => {
    window.chrome = chrome
  })

  it('should render title', async() => {
    const {
      getByTestId,
      container
    } = tree

    const title = getByTestId('address-title')
    expect(container).toContainElement(title)
    expect(title).toHaveTextContent('Address')
  })

  it('should render address', async() => {
    const {
      getByTestId,
      container
    } = tree

    const address = getByTestId('address-info')
    expect(container).toContainElement(address)
    expect(address).toHaveTextContent(/ck|loading|null|undefined|/)
  })
});

