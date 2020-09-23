import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage } from 'react-intl';
import { MESSAGE_TYPE } from '@utils/constants';

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 120,
    },
  }),
);

const BootstrapButton = withStyles({
  root: {
    width: 208,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '8px 12px',
    border: '1px solid',
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
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
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GEN_MNEMONIC });
    history.push('/generate-mnemonic');
  };

  const classes = useStylesTheme();

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={4}>
        <Grid item xs={12} container justify="center">
          <BootstrapButton
            type="button"
            variant="contained"
            id="import-button"
            color="primary"
            onClick={onImport}
            data-testid="import-button"
          >
            <FormattedMessage id="Import Mnemonic" />
          </BootstrapButton>
        </Grid>
        <Grid item xs={12} container justify="center">
          <BootstrapButton
            type="button"
            variant="contained"
            id="generate-button"
            color="primary"
            onClick={onGenerate}
            data-testid="generate-button"
          >
            <FormattedMessage id="Generate Mnemonic" />
          </BootstrapButton>
        </Grid>
      </Grid>
    </div>
  );
}
