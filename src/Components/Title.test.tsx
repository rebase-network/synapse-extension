import * as React from 'react'
import { shallow } from 'enzyme'
import Title from './Title'

describe('Title', () => {
  let wrapper
  beforeEach(() => wrapper = shallow(<Title title={''} />))

  it('should render Title', () => {
    expect(wrapper.find('div').length).toEqual(1)
  });

  it('should render title text', () => {
    wrapper.setProps({ title: 'Import Mnemonic'})
    expect(wrapper.text()).toEqual('Import Mnemonic')
  });


})