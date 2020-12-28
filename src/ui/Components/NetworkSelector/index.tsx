import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MenuItem, FormControl, Select } from '@material-ui/core';
import NetworkManager from '@common/networkManager';
import { MESSAGE_TYPE } from '@src/common/utils/constants';

const customRPCKey = 'custom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    select: {
      color: 'white',
      paddingLeft: '0.5rem',
    },
    link: {
      color: '#333',
      textDecoration: 'none',
      paddingTop: '1rem',
      borderTop: '1px solid #aaa',
    },
  }),
);

interface AppProps {
  handleNetworkChange: Function;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const [network, setNetwork] = React.useState('');
  const [networkItems, setNetworkItems] = React.useState([]);

  React.useEffect(() => {
    NetworkManager.getNetworkList().then((networkList) => {
      if (Array.isArray(networkList) && networkList.length > 0) {
        setNetworkItems(networkList);
      }
    });
  }, []);

  React.useEffect(() => {
    NetworkManager.getCurrentNetwork().then((currentNetwork) => {
      if (!_.isEmpty(currentNetwork)) {
        setNetwork(currentNetwork.title);
      }
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const { value } = event.target;
    if (value === customRPCKey) {
      return;
    }
    setNetwork(value);
    props.handleNetworkChange(value);
    NetworkManager.setCurrentNetwork(value);
    browser.runtime.sendMessage({ type: MESSAGE_TYPE.NETWORK_CHANGED, data: value });
  };

  const handleOpen = () => {
    NetworkManager.getNetworkList().then((networkList) => {
      if (Array.isArray(networkList) && networkList.length > 0) {
        setNetworkItems(networkList);
      }
    });
  };

  const menuItems = networkItems.map((item) => {
    return (
      <MenuItem value={item.title} key={`${item.title}-${item.nodeURL}`}>
        {item.title}
      </MenuItem>
    );
  });

  const customRPCItem = (
    <MenuItem value={customRPCKey} key={customRPCKey}>
      <Link to="/manage-networks" className={classes.link}>
        <FormattedMessage id="Custom RPC" />
      </Link>
    </MenuItem>
  );

  menuItems.push(customRPCItem);

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="network-select-label"
          id="network-select"
          value={network}
          onChange={handleChange}
          onOpen={handleOpen}
          className={classes.select}
        >
          {menuItems}
        </Select>
      </FormControl>
    </div>
  );
};
