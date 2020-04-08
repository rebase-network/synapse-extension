import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    margin: 30,
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
      <Title title="Transaction Detail" testId="tx-detail-title" />

    </div>
  )
}
