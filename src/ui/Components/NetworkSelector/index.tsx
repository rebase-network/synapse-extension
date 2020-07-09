import React from 'react';
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
  const [network, setNetwork] = React.useState('testnet');
  const [networkItems, setNetworkItems] = React.useState([]);

  React.useEffect(() => {
    NetworkManager.getNetworkList().then((networkList) => {
      if (Array.isArray(networkList) && networkList.length > 0) {
        setNetworkItems(networkList);
      }
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNetwork(event.target.value);
    props.handleNetworkChange(event.target.value);
  };

  const menuItems = networkItems.map((item) => {
    return <MenuItem value={item.name}>{item.name}</MenuItem>;
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
          className={classes.select}
        >
          {menuItems}
        </Select>
      </FormControl>
    </div>
  );
};
