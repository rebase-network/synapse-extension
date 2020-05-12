import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { truncateAddress } from '../../../utils/formatters';
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

  return <div className={classTheme.root}>{addressesElem}</div>;
}
