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
    Link: 'a',
  };
});

describe('export privatekey second page', () => {
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

    const elemContainer = getByTestId('container');
    expect(container).toContainElement(elemContainer);
    expect(elemContainer).toHaveTextContent('PrivateKey');
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const elemContainer = getByTestId('container');
    expect(container).toContainElement(elemContainer);
    expect(elemContainer).toHaveTextContent('Keystore');
  });
});
