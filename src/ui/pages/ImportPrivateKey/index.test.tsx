import * as React from 'react';
import App from '../../App';
import { render, fireEvent, waitFor, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as chrome from 'sinon-chrome';
import ImportPrivateKey from './index';

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

describe('import privateKey page', () => {
  let tree, container, getByTestId;
  beforeEach(() => {
    tree = render(<ImportPrivateKey />);
    container = tree.container;
    getByTestId = tree.getByTestId;
  });

  beforeAll(() => {
    window.chrome = chrome;
  });

  it('should change privateKey form fields', async () => {
    const { getByTestId, container } = tree;

    const privateKey = container.querySelector('[name="privateKey"]');
    const password = container.querySelector('[name="password"]');

    expect(privateKey).toBeEmpty();
    expect(password).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(privateKey, {
        target: {
          value: 'test 0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
        },
      });
      fireEvent.change(password, { target: { value: 'test 123456' } });
    });

    expect(container.querySelector('#form-privateKey')).toHaveFormValues({
      privateKey: 'test 0x6e678246998b426db75c83c8be213b4ceeb8ae1ff10fcd2f8169e1dc3ca04df1',
      password: 'test 123456',
    });
  });

  it('should change keystore form fields', async () => {
    const { getByTestId, container } = tree;

    const keystore = container.querySelector('[name="keystore"]');
    const keystorePassword = container.querySelector('[name="keystorePassword"]');
    const userPassword = container.querySelector('[name="userPassword"]');

    expect(keystore).toBeEmpty();
    expect(keystorePassword).toBeEmpty();
    expect(userPassword).toBeEmpty();

    await waitFor(() => {
      fireEvent.change(keystore, { target: { value: 'test keystore' } });
      fireEvent.change(keystorePassword, { target: { value: 'test keystorePassword 123456' } });
      fireEvent.change(userPassword, { target: { value: 'test userPassword 123456' } });
    });

    expect(container.querySelector('#form-keystore')).toHaveFormValues({
      keystore: 'test keystore',
      keystorePassword: 'test keystorePassword 123456',
      userPassword: 'test userPassword 123456',
    });
  });

  // it('should render keystore radio', async () => {
  //   const { getByTestId, container } = tree;
  //   const keystoreLable = getByTestId('testid-keystore-radio');
  //   expect(container).toContainElement(keystoreLable);
  //   expect(keystoreLable).toHaveAttribute("label","Keystore");
  // });

  // it('should render amount', async () => {
  //   const amount = screen.queryByTestId('amount');
  //   expect(container).toContainElement(amount);
  //   expect(amount).toHaveTextContent("0")
  // });

  // it('should render inputs', async () => {
  //   const inputs = screen.queryByTestId('inputs');
  //   expect(container).toContainElement(inputs);
  //   expect(inputs).toHaveTextContent("inputs")
  // });

  // it('should render outputs', async () => {
  //   const outputs = screen.queryByTestId('outputs');
  //   expect(container).toContainElement(outputs);
  //   // expect(outputs).toHaveTextContent("ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70")
  //   expect(outputs).toHaveTextContent("outputs")
  // });

  // it('should render TxHash', async () => {
  //   const txHash = screen.queryByTestId('txHash');
  //   expect(container).toContainElement(txHash);
  //   expect(txHash).toHaveTextContent("TxHash")
  // });
});
