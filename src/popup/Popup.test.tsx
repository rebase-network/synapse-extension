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

  it('simulates click events', () => {
    // const onButtonClick = sinon.spy();
    // const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    // wrapper.find('button').simulate('click');
    // expect(onButtonClick).to.have.property('callCount', 1);
  });

  // it('should get submitted values', () => {
  //   // const values = wrapper.instance
  //   const fakeEvent = { preventDefault: () => console.log('preventDefault') };
  //   // expect(wrapper.find('.form-login').length).toBe(1);
  //   wrapper.find('.form-mnemonic').simulate('submit', fakeEvent);
  //   expect(wrapper.find('.success').length).toBe(1);
  // })

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