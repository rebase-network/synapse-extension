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
  
  const [address, setAddress] = React.useState("ckt1qyq8x6zypd3wpe3n5hpyntuwqt2dmph0ee9qeg279y");
  const [capacity, setCapacity] = React.useState("100");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function ( request, sender, sendResponse) {
      
      //
      console.log("REQUEST_TX_DETAIL =>=>=>");
      chrome.runtime.sendMessage({
          messageType: MESSAGE_TYPE.REQUEST_TX_DETAIL 
      })
    })
  }, [])

  return (
    <div className={classes.container}>
      <Title title="My Addresses" testId="my-addresses-title" />
      <div className="address" data-testid="address">
          {address}
      </div>

      <div className="capacity" data-testid="capacity">
          {capacity}
      </div>
      <br/>
    </div>
  )
}
