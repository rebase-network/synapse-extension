import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
// import AddressListItem from '@ui/Components/AddressListItem';
import { showAddressHelper } from '@src/common/utils/wallet';

const useStyles = makeStyles({
  loading: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: {
    borderBottom: '1px solid #ccc',
  },
});

interface AppProps {
  onSelectAddress: Function;
  AddressListItem: any;
}

export default (props: AppProps) => {
  const { onSelectAddress, AddressListItem } = props;
  const [addressesList, setAddressesList] = React.useState([]);
  const [prefix, setPrefix] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    const getAddressesList = async () => {
      const { addressesList: addressesListArr, currentNetwork } = await browser.storage.local.get([
        'addressesList',
        'currentNetwork',
      ]);
      setPrefix(currentNetwork.prefix);

      setLoading(false);
      if (!addressesListArr) return;
      setAddressesList(addressesListArr);
    };
    getAddressesList();
  }, []);

  if (loading) return <div className={classes.loading}>Loading Address List...</div>;

  const addressesElem = addressesList.map((addressesObj, index) => {
    const addressGroup = addressesObj.addresses
      .filter((add) => add.type !== 'Keccak256') // do not show keccak256
      .map((item) => {
        const address = showAddressHelper(prefix, item.script);
        const addressInfo = { ...item, publicKey: addressesObj.publicKey, address };
        return (
          <List component="nav" aria-label="Address List" key={`item-${address}`}>
            <AddressListItem
              key={`item-${address}`}
              addressInfo={addressInfo}
              onSelectAddress={onSelectAddress}
            />
          </List>
        );
      });

    // hide border for last item
    const notLastItem = index !== addressesList.length - 1;
    const borderClass = notLastItem ? classes.address : '';
    return (
      <div className={borderClass} key={addressesObj.publicKey}>
        {addressGroup}
      </div>
    );
  });

  return <div>{addressesElem}</div>;
};
