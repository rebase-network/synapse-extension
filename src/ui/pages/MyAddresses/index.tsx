import * as React from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MESSAGE_TYPE } from '../../../utils/constants';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    marginLeft: '10px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  textField: {},
});

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.palette.background.paper,
      marginTop: '0px',
      marginBottom: '0px',
    },
    demo: {
      // backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(1, 0, 1),
    },
    ListSubheader: {
      font: '10px',
      height: '4px',
      inlineSize: '4px',
    },
    inline: {
      display: 'inline',
    },
  }),
);

const listItemTheme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiListItem: {
      // Name of the rule
      root: {
        // Some CSS
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        // borderRadius: 3,
        border: 0,
        // color: 'black',
        height: '56px',
        // padding: '0 13px',
        marginTop: '0px',
        marginBottom: '0px',
      },
    },
  },
});

interface AppProps {}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [addressesList, setAddressesList] = React.useState([]);
  const history = useHistory();

  const classTheme = useStylesTheme();

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_MY_ADDRESSES,
    });
  }, []);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.messageType == MESSAGE_TYPE.RESULT_MY_ADDRESSES) {
        const addressesList = request.addressesList;
        setAddressesList(addressesList);
      }

      if (request.messageType == MESSAGE_TYPE.RETURN_SELECTED_MY_ADDRESSES) {
        history.push('/address');
      }
    });
  }, []);

  const handleClickOpen = () => {
    history.push('/import-private-key');
  };

  const handleListItemClick = (event, addressObj, publicKey) => {
    chrome.runtime.sendMessage({
      addressObj,
      publicKey,
      messageType: MESSAGE_TYPE.SELECTED_MY_ADDRESSES,
    });
  };

  const addressesElem = addressesList.map((addressesObj, index) => {
    return addressesObj.addresses.map((item, index) => {
      return (
        <List
          component="nav"
          aria-label="main mailbox folders"
          key={`item-${item.address}`}
          className={classTheme.root}
        >
          <ThemeProvider theme={listItemTheme}>
            <ListItem
              button
              key={`item-${item.address}`}
              onClick={(event) => handleListItemClick(event, item, addressesObj.publicKey)}
            >
              <ListItemText
                primary={item.addressBack}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classTheme.inline}
                      color="textPrimary"
                    >
                      {item.amount + ' CKB'}
                    </Typography>
                    <br />
                    {item.type}
                  </React.Fragment>
                }
              />
            </ListItem>
          </ThemeProvider>
        </List>
      );
    });
  });

  return (
    <div>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classTheme.title}>
          My Addresses
        </Typography>
        <Button
          type="button"
          id="import-button"
          color="primary"
          variant="contained"
          className={classes.button}
          data-testid="import"
          onClick={handleClickOpen}
        >
          Import
        </Button>
        <div className={classTheme.demo}>{addressesElem}</div>
        <Button
          type="button"
          id="import-button"
          color="primary"
          variant="contained"
          className={classes.button}
          data-testid="import"
          onClick={handleClickOpen}
        >
          Import
        </Button>
      </Grid>
    </div>
  );
}
