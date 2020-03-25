import * as React from 'react'
import { shallow } from 'enzyme'
import Title from './Title'

describe('Title', () => {
  let wrapper
  beforeEach(() => wrapper = shallow(<Title title={''} />))

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render Title', () => {
    expect(wrapper.find('h3').length).toEqual(1)
  });

  it('should render title text', () => {
    wrapper.setProps({ title: 'Import Mnemonic'})
    expect(wrapper.text()).toEqual('Import Mnemonic')
  });


})