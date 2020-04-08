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
  
  const [amount, setAmount] = React.useState('0');
  const [fee, setFee] = React.useState('0');

  return (
    <div className={classes.container}>
      <Title title="Transaction Detail" testId="tx-detail-title" />
      <div className="amount" data-testid="amount">
          <span className="">Amount  </span>
          {amount}
          <span className="">  CKB</span>
      </div>

      <div className="fee" data-testid="fee">
          <span className="">Fee  </span>
          {fee}
          <span className="">  CKB</span>
      </div>

      <div className="inputs" data-testid="inputs">
          <span className="">inputs  </span>
          {"ckt1qyqv6ztcvwywkj8q6xmpd4ukf9zlr2rwnfzq4s7eek"}
      </div>
      
      <div className="outputs" data-testid="outputs">
          <span className="">outputs  </span>
          {"ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70"}
      </div>

      <div className="" data-testid="">
          <span className=""> ------------ </span>
      </div>

      <div className="txHash" data-testid="txHash">
          <span className=""> TxHash </span>
          {"0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead"}
      </div>

    </div>
  )
}
