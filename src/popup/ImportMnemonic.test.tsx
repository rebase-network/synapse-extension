import * as React from 'react';
import { MemoryRouter } from 'react-router-dom'
import App from './App';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('React testing library', () => {
  let tree, container, getByTestId
  beforeEach(() => {
    tree = render(
      <MemoryRouter initialEntries = {['/']}>
        <App />
     </MemoryRouter>
    );
    container = tree.container
    getByTestId = tree.getByTestId
  });

  afterEach(cleanup)

  it('should render form fields: Mnemonic', async() => {
    const mnemonic = container.querySelector('[name="mnemonic"]')
    expect(container).toContainElement(mnemonic)
  })

  it('should render form fields: Password', async() => {
    const password = container.querySelector('[name="password"]')
    expect(container).toContainElement(password)
  })

  it('should render form fields: Confirm Password', async() => {
    const confirmPassword = container.querySelector('[name="confirm-password"]')
    expect(container).toContainElement(confirmPassword)
  })

  it('should change form fields: Mnemonic', async() => {
    const mnemonic = container.querySelector('[name="mnemonic"]')

    await waitFor(() => {
      fireEvent.change(mnemonic, { target: { value: "foo@bar.com" } });
    })

    expect(mnemonic.textContent).toBe("foo@bar.com");
  })


});

