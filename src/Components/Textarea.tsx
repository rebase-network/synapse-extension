import * as React from "react";

interface AppProps {
  onChange: any;
}

interface AppState {}

export default class extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  render() {
    return (
      <div>
        <textarea onChange={this.props.onChange} />
      </div>
    )
  }
}