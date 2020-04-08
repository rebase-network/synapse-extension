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
  
  const [status, setStatus] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [fee, setFee] = React.useState(0);
  const [inputs, setInputs] = React.useState("");
  const [outputs, setOutputs] = React.useState("");
  const [txHash, setTxHash] = React.useState("");

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.messageType === MESSAGE_TYPE.TX_DETAIL) {
        setAmount(message.tradeAmount);
        setStatus(message.status);
        setFee(message.fee);
        setInputs(message.inputs);
        setOutputs(message.outputs);
        setTxHash(message.txHash);
      }
    })
  }, [])

  return (
    <div className={classes.container}>
      <Title title="Transaction Detail" testId="tx-detail-title" />
      <div className="status" data-testid="status">
          <span className="">status  </span>
          {status}
      </div>
      <br/>
      <br/>
      <div className="amount" data-testid="amount">
          <span className="">Amount  </span>
          {amount}
          <span className="">  CKB</span>
      </div>
      <br/>
      
      <div className="fee" data-testid="fee">
          <span className="">Fee  </span>
          {fee}
          <span className="">  CKB</span>
      </div>
      <br/>

      <div className="inputs" data-testid="inputs">
          <span className="">inputs  </span>
          {inputs}
      </div>
      <br/>
      
      <div className="outputs" data-testid="outputs">
          <span className="">outputs  </span>
          {outputs}
      </div>
      <br/>

      <div className="" data-testid="">
          <span className=""> ------------ </span>
      </div>
      <br/>

      <div className="txHash" data-testid="txHash">
          <span className=""> TxHash </span>
          {txHash}
      </div>
      <br/>
      
    </div>
  )
}
