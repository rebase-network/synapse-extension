import * as React from 'react';
import Title from '../../Components/Title';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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
  home: {},
  button: {
    'margin-bottom': '20px',
  },
});

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '120px',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    button: {
      'margin-left': '60px',
      'margin-bottom': '20px',
      padding: theme.spacing(3),
    },
    title: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const BootstrapButton = withStyles({
  root: {
    width: '208px',
    size: 'medium',
    // marginTop: '225px',
    marginBottom: '25px',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '8px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    // '&:hover': {
    //   backgroundColor: '#0069d9',
    //   borderColor: '#0062cc',
    //   boxShadow: 'none',
    // },
    // '&:active': {
    //   boxShadow: 'none',
    //   backgroundColor: '#0062cc',
    //   borderColor: '#005cbf',
    // },
    // '&:focus': {
    //   boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    // },
  },
})(Button);

interface AppProps {}
interface AppState {}

export default function (props: AppProps, state: AppState) {
  const history = useHistory();

  const onImport = () => {
    history.push('/import-mnemonic');
  };

  const onGenerate = () => {
    chrome.runtime.sendMessage({ messageType: MESSAGE_TYPE.GEN_MNEMONIC });
    history.push('/generate-mnemonic');
  };

  const classes = useStylesTheme();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BootstrapButton
            type="button"
            variant="contained"
            id="import-button"
            color="primary"
            onClick={onImport}
            className={classes.button}
            data-testid="import-button"
          >
            Import Mnemonic
          </BootstrapButton>
        </Grid>
        <Grid item xs={12}>
          <BootstrapButton
            type="button"
            variant="contained"
            id="generate-button"
            color="primary"
            onClick={onGenerate}
            className={classes.button}
            data-testid="generate-button"
          >
            Generate Mnemonic
          </BootstrapButton>
        </Grid>
      </Grid>
    </div>
  );
}
