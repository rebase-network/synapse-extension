import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from './UploadFile';

describe('Upload file', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <App />
      </IntlProvider>,
    );
  });
  it('upload file', async () => {
    const uploadBtn = await screen.findByRole('button', { name: 'Upload Keystore JSON File' });
    expect(uploadBtn).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Keystore JSON File') as HTMLInputElement;

    userEvent.upload(input, file);

    expect(input.files[0]).toStrictEqual(file);
    expect(input.files.item(0)).toStrictEqual(file);
    expect(input.files).toHaveLength(1);
  });
});
