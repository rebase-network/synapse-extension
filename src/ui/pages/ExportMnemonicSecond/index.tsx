import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
  const [mnemonic, setMnemonic] = React.useState([]);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function ( request, sender, sendResponse) {
      
      console.log("request ===>",request);
      if (request.messageType === MESSAGE_TYPE.EXPORT_MNEONIC_SECOND_RESULT) {
          const mnemonic = request.mnemonic;
          setMnemonic(mnemonic);
      }
    })
  }, [])

  return (
    <div className={classes.container}>
      <Title title="Export Mneonic" testId="export-mneonic-title" />
      <br/>
      <div className="mnemonic" data-testid="mnemonic-id">
          {/* <span className="">JSON/Keystore  </span> */}
          {mnemonic}
      </div>
      <br/>
    </div>
  )
}
