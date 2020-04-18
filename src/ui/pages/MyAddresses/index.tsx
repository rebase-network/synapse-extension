import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {

  },
  textField: {

  }
});

const useStyles02 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 600,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(1, 0, 1),
    },
  }),
);

interface AppProps { }

interface AppState { }


export default function (props: AppProps, state: AppState) {

  const classes = useStyles();
  const [addresses, setAddresses] = React.useState([]);
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
        const addresses = request.addresses;
        setAddresses(addresses);
      }

    });
  }, []);

  const handleClickOpen = () => {
    console.log(" ------ export privateKey --- ");
  };

  const addressesElem = addresses.map((item, index) => {
    return (
      <div>
          <div className="address" data-testid="address">
            {item.address}
          </div>
          <div className="capacity" data-testid="capacity">
            {item.capacity} CKB
          </div>
          <div className="type" data-testid="type">
            {item.type}
          </div>
      </div>
      // <ListSubheader>{ item.address }</ListSubheader>
      // <ListItem>
      //   <ListItemText primary= {item.type} secondary= {item.capacity + "CKB"} />
      // </ListItem>
      // <li key={`section-${item.address}`} >
      //     <ul >
      //       <ListSubheader>{ item.address }</ListSubheader>
      //       <ListItem key={`item-${item.address}`}>
      //           <ListItemText primary= {item.type} secondary= {item.capacity + "CKB"} />
      //       </ListItem>
      //     </ul>
      // </li>
    )
  })

  return (
    // <div className={classes.container}>
    //   <Title title="My Addresses" testId="my-addresses-title" />
    //     {addressesElem}
    // </div>
    <div>
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
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes02.title}>
          My Addresses
        </Typography>
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
      </Grid>  
    </div>
  );  
}
