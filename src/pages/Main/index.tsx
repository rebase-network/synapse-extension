import * as React from 'react';
import Title from '../../Components/Title'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    height: 600,
    width: 357,
    minHeight: 500,
    margin: 30,
    boxSizing: 'border-box'
  },
  button: {

  },
  textField: {

  }
});


interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title title='Address' testId="address-title" />
      <div className="address">address info</div>
    </div>
  )
}
