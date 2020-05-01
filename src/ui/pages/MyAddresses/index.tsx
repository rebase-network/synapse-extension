import * as React from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
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
  textField: {

  }
});

const useStyles02 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 400,
      // backgroundColor: theme.palette.background.paper,
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
    }
  }),
);

const subheaderTheme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiListSubheader: {
      // Name of the rule
      root: {
        // Some CSS
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        // borderRadius: 3,
        border: 0,
        color: 'black',
        height: '8px',
        padding: '0 3px',
        lineHeight: '8px',
        marginTop: '4px',
        marginBottom: '4px',
      },
    },
  },
});

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
        color: 'black',
        height: '6px',
        padding: '0 13px',
        lineHeight: '6px',
        marginTop: '16px',
        marginBottom: '4px',
      },
    },
  },
});

interface AppProps { }

interface AppState { }

export default function (props: AppProps, state: AppState) {

  const classes = useStyles();
  const [addressesList, setAddressesList] = React.useState([]);
  const history = useHistory();

  const classes02 = useStyles02();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_MY_ADDRESSES
    })
  }, []);


  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((
      request, sender, sendResponse
    ) => {

      if (request.messageType === MESSAGE_TYPE.RESULT_MY_ADDRESSES) {
        const addressesList = request.addressesList;
        console.log("--- addressesList ---", addressesList);
        setAddressesList(addressesList);
      }

    });
  }, []);

  const handleClickOpen = () => {
    history.push('/import-private-key');
  };

  const addressesElem = addressesList.map((addressesObj, index) => {
    return addressesObj.addresses.map((item, index) => {
      return (
        <List key={`item-${item.address}`} className={classes02.root} >
          <ThemeProvider theme={subheaderTheme}>
            <ListSubheader >{item.address}</ListSubheader>
          </ThemeProvider>
          <ThemeProvider theme={listItemTheme}>
            <ListItem key={`item-${item.address}`} >
              <ListItemText primary={item.amount + "  CKB"} secondary={item.type} />
              {/* <ListItemText secondary= {item.type} /> */}
            </ListItem>
          </ThemeProvider>
        </List>
        /* </li> */
      )
    })
  })

  return (
    <div>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes02.title}>
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
        <div className={classes02.demo}>
          <List dense={dense}>
            {/* {generate(
              <ListItem>
                <ListItemText
                  primary= {addressesElem}
                  secondary="secondary-line item"
                />
              </ListItem>,
            )} */}
            {addressesElem}
          </List>
        </div>
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
