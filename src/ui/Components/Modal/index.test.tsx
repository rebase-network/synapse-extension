import * as React from 'react';
import Modal from './index';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Modal', () => {
  let tree, container, getByTestId;
  beforeEach(() => {
    tree = render(<Modal />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });
  afterEach(cleanup);

  // it('should render title', () => {
  //   const elem = container.querySelector('h4');
  //   expect(container).toContainElement(elem);
  //   expect(elem).toHaveTextContent('Transactions');
  // });

  // it('should render setting icon on left side', () => {
  //   const elem = getByTestId('setting-icon');
  //   expect(elem).not.toBeNull();
  // });
});
