import * as React from 'react';
import App from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';
import ExportPrivateKey from './index';

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

describe('import mnemonic page', () => {
  let tree, container, getByTestId;
  beforeEach(() => {
    tree = render(<ExportPrivateKey />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });
  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const txDetailTitle = getByTestId('export-private-key-title');
    expect(container).toContainElement(txDetailTitle);
    expect(txDetailTitle).toHaveTextContent('Export Private Key');
  });

  it('should render form fields: Password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(container).toContainElement(password);
  });

  it('should render form fields: submitbutton', async () => {
    const submitButton = getByTestId('submit-button');
    expect(container).toContainElement(submitButton);
  });

  it('should change form fields: password', async () => {
    const password = container.querySelector('[name="password"]');
    expect(password).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(password, { target: { value: 'test password' } });
    });

    expect(container.querySelector('#export-private-key')).toHaveFormValues({
      password: 'test password',
    });
  });
});
