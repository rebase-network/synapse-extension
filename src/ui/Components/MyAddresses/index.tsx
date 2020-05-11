import * as React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { MESSAGE_TYPE } from '../../../utils/constants';
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

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
      flexGrow: 1,
      width: '380px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '0px',
      marginBottom: '0px',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      width: '380px',
    },
    grid: {
      width: '380px',
    },
    typography: {
      marginLeft: '108px',
      fontSize: '20px',
    },
    adressesElem: {
      marginLeft: '28px',
    },
    // link: {
    //   // display: 'flex',
    //   textAlign: 'center',
    //   font: "40px",
    //   height: 50,
    // },
    // icon: {
    //   marginRight: theme.spacing(0.5),
    //   width: 40,
    //   height: 20,
    // },
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

const BootstrapButton = withStyles({
  root: {
    width: '208px',
    size: 'medium',
    marginTop: '25px',
    marginLeft: '88px',
    marginBottom: '25px',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 18,
    padding: '8px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
  },
})(Button);

interface AppProps {
  onSelectAddress: Function;
}

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
    props.onSelectAddress({ right: false });
  };

  function handleClickBreadcrumbs(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

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
      <div className={classTheme.root}>
        <Grid container spacing={3} className={classTheme.grid}>
          <Grid item xs={12}>
            {/* <Paper className={classTheme.paper}>My Addresses</Paper>   */}
            <Paper className={classTheme.paper}>
              <Breadcrumbs aria-label="breadcrumb" color="textPrimary">
                <Typography color="textPrimary" className={classTheme.typography}>
                  {/* {<NavigateBeforeIcon className={classTheme.icon}/>} */}
                  {/* <Link color="inherit" href="/" onClick={handleClickBreadcrumbs}> */}
                  {/* <NavigateBeforeIcon className={classTheme.icon} /> */}
                  My Addresses
                  {/* </Link> */}
                </Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <div className={classTheme.root}>
        <Grid container spacing={3} className={classTheme.grid}>
          <Grid item xs={12}>
            <div className={classTheme.adressesElem}>{addressesElem}</div>
          </Grid>

          <Divider />

          <Grid item xs={12}>
            <BootstrapButton
              type="button"
              id="import-button"
              color="primary"
              variant="contained"
              data-testid="import"
              onClick={handleClickOpen}
            >
              Import Wallet
            </BootstrapButton>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
