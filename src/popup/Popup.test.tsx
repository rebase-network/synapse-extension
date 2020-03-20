import * as React from 'react';
import { shallow } from 'enzyme';
import Popup from './Popup';
import Input from '../Components/Input';
import Title from '../Components/Title';
import Textarea from '../Components/Textarea';
import { Button } from '@material-ui/core';

describe('Popup', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Popup />));

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render title', () => {
    expect(wrapper.find(Title)).toHaveLength(1);
    // expect(wrapper.containsMatchingElement(<Title title={'Import Mnemonic'} />)).toEqual(true)
  })

  it('should render 1 Textarea', () => {
    // expect(wrapper.containsMatchingElement(<Textarea onChange={wrapper.instance.onChange} />)).toEqual(true);
    expect(wrapper.find(Textarea)).toHaveLength(1);
  });

  it('should render 2 Input', () => {
    expect(wrapper.find(Input)).toHaveLength(2);
  });

  it('should render a <Button />', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should render button text', () => {
    expect(wrapper.find(Button).text()).toEqual('Import');
  });

  it('simulates click events', () => {
    // const onButtonClick = sinon.spy();
    // const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    // wrapper.find('button').simulate('click');
    // expect(onButtonClick).to.have.property('callCount', 1);
  });

  it('should get submitted values', () => {
    // const values = wrapper.instance
    const fakeEvent = { preventDefault: () => console.log('preventDefault') };
    // expect(wrapper.find('.form-login').length).toBe(1);
    wrapper.find('.form-mnemonic').simulate('submit', fakeEvent);
    expect(wrapper.find('.success').length).toBe(1);
  })

});