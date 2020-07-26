import React from 'react';
import _ from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MenuItem, FormControl, Select } from '@material-ui/core';
import NetworkManager from '@common/networkManager';

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
    setNetwork(event.target.value);
    props.handleNetworkChange(event.target.value);
    NetworkManager.setCurrentNetwork(event.target.value);
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

  return (
    <div>
      <FormControl className={classes.formControl}>
        {/* <InputLabel id="network-select-label">Age</InputLabel> */}
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
