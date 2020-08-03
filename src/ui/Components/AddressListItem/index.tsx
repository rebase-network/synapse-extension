import React from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import {
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { truncateAddress, shannonToCKBFormatter } from '@utils/formatters';
import { getAddressInfo } from '@utils/apis';
import { showAddressHelper } from '@utils/wallet';

const useStylesTheme = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: 30,
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

interface IScript {
  codeHash: string;
  hashType: string;
  args: string;
}

interface IAddressInfo {
  address: string;
  amount: number;
  lock: string;
  type: string;
  script: IScript;
  publicKey: string;
}

interface AppProps {
  onSelectAddress: Function;
  addressInfo: IAddressInfo;
}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStylesTheme();
  const history = useHistory();
  const { addressInfo } = props;

  const { type, lock, script } = addressInfo;
  const [capacity, setCapacity] = React.useState('0');
  const [name, setName] = React.useState('');
  const [newAddr, setNewAddr] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const { capacity } = await getAddressInfo(lock);
      setCapacity(shannonToCKBFormatter(capacity));
    };

    fetchData();
  }, [lock]);

  React.useEffect(() => {
    (async () => {
      const contactStorage = await browser.storage.local.get('contacts');
      const currNetworkStorage = await browser.storage.local.get('currentNetwork');

      const addr = showAddressHelper(currNetworkStorage.currentNetwork.prefix, script);
      setNewAddr(addr);

      if (_.isEmpty(contactStorage)) return;

      const { contacts } = contactStorage;

      _.find(contacts, (ele) => {
        if (ele.address === addr) {
          setName(ele.name);
        }
      });
    })();
  }, []);

  const handleListItemClick = (event, addressInfo: IAddressInfo) => {
    const currentWallet = _.clone(addressInfo);
    delete currentWallet.amount;
    props.onSelectAddress({ right: false });

    browser.storage.local.set({ currentWallet });

    history.push(`/address/${addressInfo.address}`);
  };

  return (
    <ThemeProvider theme={listItemTheme}>
      <ListItem
        button
        key={`item-${newAddr}`}
        onClick={(event) => handleListItemClick(event, addressInfo)}
      >
        <ListItemText
          primary={truncateAddress(newAddr)}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {`${capacity} CKB`}
              </Typography>
              <br />
              {`${type}  ${name}`}
            </>
          }
        />
      </ListItem>
    </ThemeProvider>
  );
}
