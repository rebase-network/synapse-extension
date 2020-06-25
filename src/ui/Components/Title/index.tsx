import React from 'react';

interface AppProps {
  title: string;
  testId: string;
}

interface AppState {}

export default class extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  render() {
    return <h3 data-testid={this.props.testId || 'title'}>{this.props.title}</h3>;
  }
}
