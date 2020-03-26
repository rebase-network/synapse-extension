import * as React from 'react';
import { MemoryRouter } from 'react-router-dom'
import App from './App';
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('React testing library', () => {

  it('should render Popup', async() => {
    const {
      getByPlaceholderText,
      getByTestId,
      getByText,
      debug,
      container
    } = render(
      <MemoryRouter initialEntries = {['/']}>
        <App />
     </MemoryRouter>
    );
    const mnemonic = container.querySelector('[name="mnemonic"]')
    expect(container.textContent).toMatch('Import Mnemonic')
    await waitFor(() => {
      fireEvent.change(mnemonic, { target: { value: "foo@bar.com" } });
    })

    expect(mnemonic.textContent).toBe("foo@bar.com");

    fireEvent.click(getByText(/address/i))
    const title = getByTestId('address-title')
    // expect(title.innerHTML).toMatch('Address')
    expect(title).toHaveTextContent('Address')

  })

});

