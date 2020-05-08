import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { render, fireEvent, waitFor, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';

describe('Home testing', () => {
  let tree;
  beforeEach(() => {
    tree = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
  });
  afterEach(cleanup);

  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should render home title', async () => {
    const { getByTestId, container } = tree;

    const title = getByTestId('home-title');
    expect(container).toContainElement(title);
    expect(title).toHaveTextContent('Home');
  });

  it('should render Import / Generate btn', () => {
    const { getByTestId, container } = tree;

    const btn1 = getByTestId('import-button');
    const btn2 = getByTestId('generate-button');
    expect(container).toContainElement(btn1);
    expect(container).toContainElement(btn2);
  });
});
