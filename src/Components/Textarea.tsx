import * as React from "react";

interface AppProps {
}

interface AppState {}

export default class extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  render() {
    return (
      <div>
        <textarea />
      </div>
    )
  }
}