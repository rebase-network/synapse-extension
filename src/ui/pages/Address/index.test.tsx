import * as React from 'react';
import App from './index';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';

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

describe('Address page', () => {
  let tree, container, getByTestId;
  beforeEach(() => {
    tree = render(<App />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });
  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const title = getByTestId('address-title');
    expect(container).toContainElement(title);
    expect(title).toHaveTextContent('Address');
  });

  it('should render address', async () => {
    const { getByTestId, container } = tree;

    const address = getByTestId('address-info');
    expect(container).toContainElement(address);
    expect(address).toHaveTextContent(/ck|loading|null|undefined|/);
  });

  it('should render capacity', () => {
    const capacity = screen.queryByTestId('capacity');
    expect(capacity).toBeNull();
  });

  it('should render receive / send btn', () => {
    const { getByTestId, container } = tree;

    const receiveBtn = getByTestId('receive');
    const sendBtn = getByTestId('send');
    expect(container).toContainElement(receiveBtn);
    expect(container).toContainElement(sendBtn);
  });
});
