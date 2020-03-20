import * as React from 'react'
import { shallow } from 'enzyme'
import Textarea from './Textarea'

describe('Textarea', () => {
  let wrapper
  beforeEach(() => wrapper = shallow(<Textarea onChange={jest.fn()} />))

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render Textarea', () => {
    expect(wrapper.find('textarea').length).toEqual(1)
  });

  it('should render value', () => {

  });

  // it('should render title text', () => {
  //   wrapper.setProps({ title: 'Import Mnemonic'})
  //   expect(wrapper.text()).toEqual('Import Mnemonic')
  // });


})