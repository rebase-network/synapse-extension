import * as React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface AppProps {
  to: string;
  title: string;
}

export default function DenseAppBar(props: AppProps) {
  const classes = useStyles();
  const navButton = props.to ? (
    <IconButton edge="start" className={classes.menuButton} aria-label="nav">
      <Link to={props.to}>
        <NavigateBeforeIcon />
      </Link>
    </IconButton>
  ) : (
    ''
  );
  return (
    <div className={classes.root}>
      <Toolbar>
        {navButton}
        <Typography variant="h6">{props.title}</Typography>
      </Toolbar>
    </div>
  );
}
