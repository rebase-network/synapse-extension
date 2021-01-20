import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PageNav from '@ui/Components/PageNav';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import UDTList from './List';

const useStyles = makeStyles({
  container: {
    margin: 20,
    fontSize: 12,
  },
  link: {
    color: '#666',
    marginRight: 16,
  },
  right: {
    textAlign: 'right',
  },
});

export default function UDTHome() {
  const classes = useStyles();
  const createBtn = (
    <Link to="/udts/create" className={classes.link}>
      <AddIcon />
    </Link>
  );

  return (
    <div>
      <PageNav to="/setting" title="Manage UDTs" />
      <div className={classes.container}>
        <div className={classes.right}>{createBtn}</div>
        <UDTList />
      </div>
    </div>
  );
}
