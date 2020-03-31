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

export default function SimpleSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState('Aggron');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        {/* <InputLabel id="network-select-label">Age</InputLabel> */}
        <Select
          labelId="network-select-label"
          id="network-select"
          value={age}
          onChange={handleChange}
          className={classes.select}
        >
          <MenuItem value={'Aggron'}>Aggron Testnet</MenuItem>
          <MenuItem value={'Mainnet'}>Mainnet</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
