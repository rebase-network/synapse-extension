import * as React from 'react';
import Title from '../../Components/Title'
import { Button, } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';

const useStylesPopper = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: '1px solid',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  home: {
  },
  button: {
    "margin-bottom": "20px",
  },
});


interface AppProps { }
interface AppState { }

export default function (props: AppProps, state: AppState) {

  const history = useHistory();

  const onImport = () => {
    history.push('/import-mnemonic')
  }

  const onGenerate =() =>{
    chrome.runtime.sendMessage({messageType: MESSAGE_TYPE.GEN_MNEMONIC })
    history.push('/generate-mnemonic');
  }

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title='Home' testId="home-title" />
      <div className={classes.home}>
        <Button
          type="button"
          variant="contained"
          id="import-button"
          color="primary"
          onClick={onImport}
          className={classes.button}
          data-testid="import-button"
        >
          Import Mnemonic
        </Button>

        <Button
          type="button"
          variant="contained"
          id="generate-button"
          color="primary"
          onClick={onGenerate}
          className={classes.button}
          data-testid="generate-button"
        >
          Generate Mnemonic
        </Button>
      </div>

    </div>
  )
}
