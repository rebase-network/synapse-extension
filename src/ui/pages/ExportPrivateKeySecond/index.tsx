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
  
  const [privateKey, setPrivateKey] = React.useState("");
  const [keystore, setKeystore] = React.useState("");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // if (message.messageType === MESSAGE_TYPE.TX_DETAIL) {
      // }
    })
  }, [])

  return (
    <div className={classes.container}>
      <Title title="Export Private Key" testId="export-private-key-title" />
      <div className="privateKey" data-testid="privateKey">
          <span className="">PrivateKey  </span>
          {privateKey}
      </div>
      <br/>
      <br/>
      <div className="amount" data-testid="amount">
          <span className="">JSON/Keystore  </span>
          {keystore}
      </div>
      <br/>
      
    </div>
  )
}
