import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { udtsCapacity, udtsMeta } from '@utils/fixtures/token';
import Component from './component';

describe('token list', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Component udtsCapacity={udtsCapacity} udtsMeta={udtsMeta} />
      </IntlProvider>,
    );
  });
  it('should have correct amount of Love Lina Token', () => {
    const elems = screen.getAllByRole('listitem');
    expect(elems).toHaveLength(2);
  });
});
