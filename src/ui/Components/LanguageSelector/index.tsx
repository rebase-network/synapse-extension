import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getDefaultLanguage } from '../../../utils/locale';

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
      color: 'blake',
    },
  }),
);

interface AppProps {}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const defaultLanguage = getDefaultLanguage();
  const [language, setLanguage] = React.useState(defaultLanguage);

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setLanguage(event.target.value);
    localStorage.setItem('language', event.target.value);
    location.replace('/popup.html');
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          onChange={handleChange}
          className={classes.select}
        >
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'zh'}>中文</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
