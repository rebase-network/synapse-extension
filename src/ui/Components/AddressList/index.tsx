import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AddressListItem from '@ui/Components/AddressListItem';
import { showAddressHelper } from '@utils/wallet';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    loading: {
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
interface AppProps {
  onSelectAddress: Function;
}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const [addressesList, setAddressesList] = React.useState([]);
  const [prefix, setPrefix] = React.useState('');

  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    chrome.storage.local.get(
      ['addressesList', 'currentNetwork'],
      async ({ addressesList, currentNetwork }) => {
        setPrefix(currentNetwork.prefix);

        setLoading(false);
        if (!addressesList) return;
        setAddressesList(addressesList);
      },
    );
  }, []);

  if (loading) return <div className={classes.loading}>Loading Address List...</div>;

  const addressesElem = addressesList.map((addressesObj) => {
    return addressesObj.addresses.map((item) => {
      const address = showAddressHelper(prefix, item.script);
      const addressInfo = { ...item, publicKey: addressesObj.publicKey, address };
      return (
        <List component="nav" aria-label="Address List" key={`item-${address}`}>
          <AddressListItem
            key={`item-${address}`}
            addressInfo={addressInfo}
            onSelectAddress={props.onSelectAddress}
          />
        </List>
      );
    });
  });

  return <div className={classes.root}>{addressesElem}</div>;
}
