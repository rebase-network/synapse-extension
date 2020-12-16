import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Title from './index';

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
