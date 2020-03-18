import * as React from 'react'
import { shallow } from 'enzyme'
import Textarea from './Textarea'

describe('Textarea', () => {
  let wrapper
  beforeEach(() => wrapper = shallow(<Textarea />))

  it('should render Textarea', () => {
    expect(wrapper.find('div').length).toEqual(1)
  });

  // it('should render title text', () => {
  //   wrapper.setProps({ title: 'Import Mnemonic'})
  //   expect(wrapper.text()).toEqual('Import Mnemonic')
  // });


})