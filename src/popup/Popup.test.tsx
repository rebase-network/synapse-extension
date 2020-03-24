import * as React from 'react';
import { shallow } from 'enzyme';
import Popup from './Popup';
import Title from '../Components/Title';
import { Button, TextField } from '@material-ui/core';
import { innerForm } from "./Popup";

describe('Popup', () => {
  let wrapper;
  let formikWrapper;

  beforeEach(() => {
    wrapper = shallow(<Popup />)
    formikWrapper = wrapper.find('Formik').dive()
  });

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render title', () => {
    expect(wrapper.find(Title)).toHaveLength(1);
    // expect(wrapper.containsMatchingElement(<Title title={'Import Mnemonic'} />)).toEqual(true)
  })

  it('should render mennomic TextField', () => {
    // expect(wrapper.containsMatchingElement(<TextField onChange={wrapper.instance.onChange} />)).toEqual(true);
    // expect(formikWrapper.find(TextField)).toHaveLength(3);
    const name = formikWrapper.find(TextField).first().props().name;
    // console.log(formikWrapper.find(TextField).first().props())
    expect(name).toEqual('mnemonic');

  });

  it('should render password TextField', () => {
    const name = formikWrapper.find(TextField).at(1).props().name;
    // console.log(formikWrapper.find(TextField).first().props())
    expect(name).toEqual('password');
  });

  it('should render confirm password TextField', () => {
    const name = formikWrapper.find(TextField).at(2).props().name;
    // console.log(formikWrapper.find(TextField).first().props())
    expect(name).toEqual('confirmPassword');
  });


  it('should render a <Button />', () => {
    expect(formikWrapper.find(Button)).toHaveLength(1);
  });

  it('should render button text', () => {
    expect(formikWrapper.find(Button).text()).toEqual('Import');
  });

  it('should get value from mnemonic form field', () => {
    formikWrapper.find(TextField).first().simulate('change', {
      // you must add this next line as (Formik calls e.persist() internally)
      persist: () => {},
      // simulate changing e.target.name and e.target.value
      target: {
        name: 'mnemonic',
        value: 'test mnemonic',
      },
    });
    const newValue = formikWrapper.find(TextField).first().props().value;
    expect(newValue).toEqual('test mnemonic');
  });

  it('should get value from password form field', () => {
    formikWrapper.find(TextField).first().simulate('change', {
      // you must add this next line as (Formik calls e.persist() internally)
      persist: () => {},
      // simulate changing e.target.name and e.target.value
      target: {
        name: 'password',
        value: 'test password',
      },
    });
    const newValue = formikWrapper.find(TextField).at(1).props().value;
    expect(newValue).toEqual('test password');
  });

  it('should get value from confirm password form field', () => {
    formikWrapper.find(TextField).first().simulate('change', {
      // you must add this next line as (Formik calls e.persist() internally)
      persist: () => {},
      // simulate changing e.target.name and e.target.value
      target: {
        name: 'confirmPassword',
        value: 'test confirm password',
      },
    });

    const newValue = formikWrapper.find(TextField).at(2).props().value;
    expect(newValue).toEqual('test confirm password');
  })

  test('submits the form', () => {
    expect(formikWrapper.find('#submitting')).toHaveLength(0);

    // simulate submit event. this is always sync! async calls to setState are swallowed.
    // be careful of false positives
    formikWrapper.find('Form').simulate('submit', {
      preventDefault: () => {} // no op
    });

    // Because the simulated event is 100% sync, we can use it to test the synchronous changes
    // here. Any async stuff you do inside handleSubmit will be swallowed. Thus our UI
    // will see the following changes:
    // - isSubmitting -> true (even if you set it to false asynchronously in your handleSubmit)
    // - touched: all fields
    expect(formikWrapper.find('#submitting')).toHaveLength(1);
    expect(formikWrapper.find(Button).props().disabled).toBe(true)
		expect(formikWrapper.find(Button).props().disabled).toBe(true)
  })

  it('should show success message after submit form', async () => {
    // console.log(wrapper.find('Formik').props(), formikWrapper)

    const form = formikWrapper.find('Form');
    form.simulate('submit');
    setTimeout(() => {
      expect(wrapper.find('.success').length).toBe(1);
    });
  });

  it('should get value from password form field', () => {
    // expect()
  })

  it('should get value from password confirm form field', () => {

  })

  it('should get same value from password and password confirm form field', () => {

  })

});