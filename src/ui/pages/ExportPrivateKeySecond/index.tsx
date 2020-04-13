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
  const [value, setValue] = React.useState("1");

  const [privateKey, setPrivateKey] = React.useState("");
  const [keystore, setKeystore] = React.useState("");
  const [isPrivate,setIsPrivate] = React.useState(false);
  const [isJSON,setIsJSON] = React.useState(true);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function ( request, sender, sendResponse) {
      
      console.log("EXPORT_PRIVATE_KEY_SECOND_RESULT =>",request);
      if (request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT) {
          const privateKey = request.privateKey;
          const keystore = request.keystore;
          setPrivateKey(privateKey);
          setKeystore(keystore);
      }
    })
  }, [])


  const isPrivateKeyNode = <div className="privateKey" data-testid="privateKey">
                              <span className="">PrivateKey  </span>
                              {privateKey}
                          </div>
  const isKeystoreNode =  <div className="json-keystore" data-testid="json-keystore">
                            <span className="">JSON/Keystore  </span>
                            {keystore}
                          </div>  
  //初始化
  let isVisableNode = isPrivateKeyNode;                                      
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    console.log("Value ==>",value);
    if(value === "1"){
      setIsPrivate(true);
      setIsJSON(false);
    } else {
      setIsPrivate(false);
      setIsJSON(true);   
    }
  };

  return (
    <div className={classes.container}>
      <Title title="Export Private Key" testId="export-private-key-title" />
      <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
          <FormControlLabel value="1" labelPlacement="bottom" control={<Radio />} label="PrivateKey" />
          <FormControlLabel value="2" labelPlacement="bottom" control={<Radio />} label="JSON/Keystore" />
      </RadioGroup>
      <div className="privateKey" data-testid="privateKey" hidden={isPrivate}>
          {/* <span className="">PrivateKey  </span> */}
          {privateKey}
      </div>
      <br/>
      <br/>
      <div className="json-keystore" data-testid="json-keystore" hidden={isJSON}>
          {/* <span className="">JSON/Keystore  </span> */}
          {keystore}
      </div>
      <br/>
    </div>
  )
}
