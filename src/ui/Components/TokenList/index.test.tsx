import React from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { udtsCapacity, udtsMeta, explorerUrl } from '@src/common/utils/tests/fixtures/token';
import Component from './component';

const mockFunc = jest.fn();

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: () => {
      return { push: mockFunc };
    },
    Link: 'a',
  };
});

describe('token list', () => {
  const history = useHistory();
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <Component udtsCapacity={udtsCapacity} udtsMeta={udtsMeta} explorerUrl={explorerUrl} />
        </Router>
      </IntlProvider>,
    );
  });
  it('should have correct amount of Love Lina Token', () => {
    const elems = screen.getAllByLabelText('Token List');
    expect(elems).toHaveLength(5);
  });

  it('should able to go to send tx page', () => {
    const sendBtns = screen.getAllByText('Send');
    expect(sendBtns).toHaveLength(4);
    userEvent.click(sendBtns[0]);
    expect(history.push).toBeCalled();
  });
});
