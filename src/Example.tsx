import * as React from 'react';

interface InterfaceExampleProps { items: Array<string> }

class Example extends React.Component<InterfaceExampleProps, undefined>{
  render() {
    return (
      <div>
       {
          this.props.items.map((item, i) =>
            <p key={i} >{item}</p>
          )
       }
      </div>
    );
  }
}
export default Example;