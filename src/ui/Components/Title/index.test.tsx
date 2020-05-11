import * as React from 'react';
import Title from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('React testing library', () => {
  let tree;
  beforeEach(() => {
    tree = render(<Title title="test title" testId="test-title" />);
  });
  afterEach(cleanup);

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const title = getByTestId('test-title');
    expect(container).toContainElement(title);
    expect(title).toHaveTextContent('test title');
  });
});
