import React from 'react';
import Title from './index';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Title component', () => {
  let tree;
  beforeEach(() => {
    tree = render(<Title title="test title" testId="test-title" />);
  });

  it('should render title', async () => {
    const { getByTestId, container } = tree;

    const title = getByTestId('test-title');
    expect(container).toContainElement(title);
    expect(title).toHaveTextContent('test title');
  });
});
