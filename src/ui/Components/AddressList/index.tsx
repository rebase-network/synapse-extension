import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import AddressListItem from '../AddressListItem';

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
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    chrome.storage.local.get(['addressesList'], function (result) {
      setLoading(false);
      if (!result.addressesList) return;
      setAddressesList(result.addressesList);
    });
  }, [addressesList]);

  if (loading) return <div className={classes.loading}>Loading Address List...</div>;

  const addressesElem = addressesList.map((addressesObj, index) => {
    return addressesObj.addresses.map((item, index) => {
      return (
        <List component="nav" aria-label="Address List" key={`item-${item.address}`}>
          <AddressListItem
            key={`item-${item.address}`}
            addressInfo={{ ...item, publicKey: addressesObj.publicKey }}
            onSelectAddress={props.onSelectAddress}
          />
        </List>
      );
    });
  });

  return <div className={classes.root}>{addressesElem}</div>;
}
