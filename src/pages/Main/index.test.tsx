import * as React from 'react';
import { shallow } from 'enzyme';
import Address from './index';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';

describe('Popup', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Address />)
  });

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render title', () => {
    expect(wrapper.find(Title)).toHaveLength(1);
    // expect(wrapper.containsMatchingElement(<Title title={'Import Mnemonic'} />)).toEqual(true)
  })

  it('should render address', () => {
    expect(wrapper.find('.address')).toHaveLength(1)
  })
})