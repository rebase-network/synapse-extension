import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { rawTx } from '@common/fixtures/tx';
import Component from './component';

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

describe('raw tx detail', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <Component tx={rawTx} />
        </Router>
      </IntlProvider>,
    );
  });
  it('should show inputs and outputs normally', () => {
    const elems = screen.getAllByRole('listitem');
    expect(elems).toHaveLength(12);
  });
});
