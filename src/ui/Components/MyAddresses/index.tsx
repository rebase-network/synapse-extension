import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { truncateAddress } from '../../../utils/formatters';
import PageNav from '../PageNav';
import { getBalanceByAddress } from '../../../utils/apis';

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: 30,
    },
    button: {
      marginLeft: '10px',
      marginTop: '5px',
      marginBottom: '5px',
    },
    root: {
      width: 320,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    typography: {
      marginLeft: '108px',
      fontSize: '20px',
    },
    title: {
      margin: theme.spacing(1, 0, 1),
    },
    inline: {
      display: 'inline',
    },
  }),
);

const listItemTheme = createMuiTheme({
  overrides: {
    MuiListItem: {
      root: {
        border: 0,
        height: '56px',
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
  const classes = useStylesTheme();
  const [addressesList, setAddressesList] = React.useState([]);
  const history = useHistory();

  const classTheme = useStylesTheme();

  React.useEffect(() => {
    //my addressesList
    chrome.storage.sync.get(['addressesList'], async function (result) {
      const { addressesList } = result;
      if (addressesList == null) return;
      for (let index = 0; index < addressesList.length; index++) {
        const addresses = addressesList[index].addresses;
        for (let index2 = 0; index2 < addresses.length; index2++) {
          // TODO: refactoring to make get capacity async
          const capacity = await getBalanceByAddress(addresses[index2].address);
          addresses[index2].amount = capacity;
          const { address } = addresses[index2];
          const shortAddress = truncateAddress(address);
          addresses[index2].shortAddress = shortAddress;
        }
      }
      setAddressesList(addressesList);
    });
  }, []);

  const handleClickOpen = () => {
    history.push('/import-private-key');
  };

  const handleListItemClick = (event, addressObj, publicKey) => {
    const currentWallet = {
      publicKey: publicKey,
      address: addressObj.address,
      type: addressObj.type,
      lock: addressObj.lock,
    };
    props.onSelectAddress({ right: false });

    chrome.storage.sync.set({ currentWallet });

    history.push(`/address/${addressObj.address}?type=${addressObj.type}`);
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
                primary={item.shortAddress}
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
      <PageNav to="" title="My Addresses" />

      <div className={classTheme.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>{addressesElem}</div>
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
