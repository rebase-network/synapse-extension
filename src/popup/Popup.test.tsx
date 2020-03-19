import * as React from 'react';
import { shallow } from 'enzyme';
import Popup from './Popup';
import Input from '../Components/Input';
import Title from '../Components/Title';
import Textarea from '../Components/Textarea';

describe('Popup', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Popup />));

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  it('should render title', () => {
    expect(wrapper.containsMatchingElement(<Title title={'Import Mnemonic'} />)).toEqual(true)
  })

  it('should render 1 Textarea', () => {
    expect(wrapper.containsMatchingElement(<Textarea onChange={wrapper.instance.onChange} />)).toEqual(true);
  });

  it('should render 2 Input', () => {
    expect(wrapper.find('Input').length).toEqual(2);
  });

  it('should render the Input Component', () => {
    expect(wrapper.containsMatchingElement(<Input />)).toEqual(true);
  });

  it('should render the Input and button Components', () => {
    expect(wrapper.containsAllMatchingElements([
      <div className="popupContainer">
        <Title title='Import Mnemonic' />
        <Textarea onChange={wrapper.instance.onChange} />
        <Input />
        <Input />
        <button>Import</button>
      </div>
    ])).toEqual(true);
  });

  it('should render a <Button />', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('should render button text', () => {
    expect(wrapper.find('button').text()).toEqual('Import');
  });

  it('simulates click events', () => {
    // const onButtonClick = sinon.spy();
    // const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    // wrapper.find('button').simulate('click');
    // expect(onButtonClick).to.have.property('callCount', 1);
  });
});