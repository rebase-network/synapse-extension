import * as React from 'react';
import { MemoryRouter } from 'react-router-dom'
import App from '../../App';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import * as chrome from "sinon-chrome";

describe('import mnemonic', () => {
  let tree, container, getByTestId
  beforeEach(() => {
    tree = render(
      <MemoryRouter initialEntries = {['/import-mnemonic']}>
        <App />
     </MemoryRouter>
    );
    container = tree.container
    getByTestId = tree.getByTestId
  });

  beforeAll(() => {
    window.chrome = chrome
  })

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
    const confirmPassword = container.querySelector('[name="confirmPassword"]')
    expect(container).toContainElement(confirmPassword)
  })

  // it('should change form fields: Mnemonic', async() => {
  //   const mnemonic = container.querySelector('[name="mnemonic"]')

  //   expect(mnemonic).toBeEmpty()

  //   await waitFor(() => {
  //     fireEvent.change(mnemonic, { target: { value: "test mnemonic" } });
  //   })

  //   expect(mnemonic.textContent).toBe("test mnemonic");
  // })

  it('should change form fields: password', async() => {
    const mnemonic = container.querySelector('[name="mnemonic"]')
    const password = container.querySelector('[name="password"]')
    const confirmPassword = container.querySelector('[name="confirmPassword"]')

    expect(mnemonic).toBeEmpty()
    expect(password).toBeEmpty()
    expect(confirmPassword).toBeEmpty()

    await waitFor(() => {
      fireEvent.change(mnemonic, { target: { value: "test mnemonic" } });
      fireEvent.change(password, { target: { value: "test password" } });
      fireEvent.change(confirmPassword, { target: { value: "test password" } });
    })

    expect(container.querySelector('#form-mnemonic')).toHaveFormValues({
      mnemonic: "test mnemonic",
      password: "test password",
      confirmPassword: "test password",
    })
  })


});

