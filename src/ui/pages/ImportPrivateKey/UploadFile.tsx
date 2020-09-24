import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles({
  input: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  label: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    cursor: 'pointer',
    display: 'inline-block',
    overflow: 'hidden',
    zIndex: 99,
    width: '100%',
    padding: '8px 15px',
    color: 'rgba(0, 0, 0, 0.54)',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 2,
    fontWeight: 400,
  },
});

export default function UploadFile() {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const handleChange = (e) => {
    const file = e.target.files[0];
    console.log('file', file);
  };
  return (
    <div>
      <input type="file" id="keystore" onChange={handleChange} className={classes.input} />
      <label htmlFor="keystore" className={classes.label}>
        Upload Keystore
      </label>
    </div>
  );
}
