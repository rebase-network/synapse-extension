import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { udtInfo } from './fixture';

describe('token list', () => {
  it('should render Love Lina Token', () => {
    const elem = screen.getByText('Love Lina Token');
    expect(elem).toBeInTheDocument();
  });
  it('should have correct amount of Love Lina Token', () => {
    const elem = screen.getByText('900');
    expect(elem).toBeInTheDocument();
  });
});
