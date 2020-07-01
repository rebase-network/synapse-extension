import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@ui/pages/locales/en';
import { udtsCapacity } from './fixture';
import Component from './component';

describe('token list', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Component udtsCapacity={udtsCapacity} />
      </IntlProvider>,
    );
  });
  // it('should render Love Lina Token', () => {
  //   const elem = screen.getByText('Love Lina Token');
  //   console.log('token elem: ', elem);
  //   expect(elem).toBeInTheDocument();
  // });
  it('should have correct amount of Love Lina Token', () => {
    const elems = screen.getAllByRole('listitem');
    expect(elems).toHaveLength(2);
  });
});
