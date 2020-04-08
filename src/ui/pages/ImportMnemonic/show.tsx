import * as React from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../Components/Title';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { AppContext } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  container: {
    margin: 30
  },
  button: {},

}));

interface AppProps {}

interface AppState {}

export function ShowMnemonic(props: AppProps, state: AppState) {
  const classes = useStyles();
  const [mnemonic, setMnemonic] = React.useState("");
  const { network } = React.useContext(AppContext);
  const history = useHistory();

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (msg, sender, sendResp) =>{
        if (msg.messageType === MESSAGE_TYPE.RECE_MNEMONIC) {

          console.log("msg =>", msg)

          if (msg.mnemonic) {
            setMnemonic(msg.mnemonic)
          } else {
            // history.push('/')
          }
        }
      });

  }, []);

  React.useEffect(() => {

  }, []);

  return (
    <div className={classes.container}>
      <Title title="Show mnemonic" testId="" />
      <span>请保存好您的助记词</span> <br/>
      <span>请保存好您的助记词</span> <br/>
      <span>请保存好您的助记词</span> <br/>

      <div className={classes.root} data-testid="mnemonic-info">
        {mnemonic}
      </div>
    </div>
  );
}
