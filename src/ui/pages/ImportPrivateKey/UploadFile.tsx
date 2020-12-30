import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ArrowUpwardRounded from '@material-ui/icons/ArrowUpwardRounded';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles({
  input: {
    display: 'none',
  },
  button: {
    width: '100%',
    marginTop: 24,
    marginBottom: 8,
  },
  name: {
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: 12,
    fontWeight: 400,
  },
});

export default function UploadFile(props) {
  const classes = useStyles();
  const [name, setName] = React.useState('');

  const handleChange = (e) => {
    const file: any = e.target.files[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      props.onChange(content);
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div>
      <input
        accept=".json"
        className={classes.input}
        id="keystore-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="keystore-file">
        <Button
          className={classes.button}
          variant="outlined"
          component="span"
          endIcon={<ArrowUpwardRounded />}
        >
          <FormattedMessage id="Upload Keystore JSON File" />
        </Button>
      </label>
      {name && <div className={classes.name}>{name}</div>}
    </div>
  );
}
