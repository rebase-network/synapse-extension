import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import App from './index';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('Manage networks page', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = screen.getByRole('button', { name: /Add/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should change form fields: name', async () => {
    const name = screen.getByLabelText('NetWork Name');
    const expectedValue = 'Mainnet';

    expect(name).toBeInTheDocument();
    expect(name).toBeEmpty();

    await userEvent.type(name, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      name: expectedValue,
    });
  });

  it('should change form fields: nodeURL', async () => {
    const nodeURL = screen.getByLabelText('CKB Node URL');
    const expectedValue = 'https://rpc.mainnet.com';

    expect(nodeURL).toBeInTheDocument();
    expect(nodeURL).toBeEmpty();

    await userEvent.type(nodeURL, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      nodeURL: expectedValue,
    });
  });

  it('should change form fields: cacheURL', async () => {
    const cacheURL = screen.getByLabelText('CKB Cache Layer URL');
    const expectedValue = 'https://cache.mainnet.com';

    expect(cacheURL).toBeInTheDocument();
    expect(cacheURL).toBeEmpty();

    await userEvent.type(cacheURL, expectedValue);

    expect(screen.getByRole('form')).toHaveFormValues({
      cacheURL: expectedValue,
    });
  });
});
