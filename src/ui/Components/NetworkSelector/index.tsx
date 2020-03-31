import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    }
  }),
);

interface AppProps { handleNetworkChange: Function }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const [network, setNetwork] = React.useState('testnet');

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setNetwork(event.target.value);
    props.handleNetworkChange(event.target.value)
  };

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
          <MenuItem value={'testnet'}>Aggron Testnet</MenuItem>
          <MenuItem value={'mainnet'}>Mainnet</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
