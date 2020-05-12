import * as React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menuButtonRight: {
      marginRight: theme.spacing(2),
      position: 'absolute',
      right: 10,
    },
  }),
);

interface AppProps {
  to: string;
  title: string;
  position?: string;
  onClickRight?: Function;
}

export default function PageNav(props: AppProps) {
  const classes = useStyles();
  let navButtonBefore;
  let navButtonNext;
  if (props.to && props.position !== 'right') {
    navButtonBefore = (
      <IconButton edge="start" className={classes.menuButton} aria-label="nav">
        <Link to={props.to}>
          <NavigateBeforeIcon />
        </Link>
      </IconButton>
    );
  } else if (props.position === 'right') {
    navButtonNext = (
      <IconButton
        edge="start"
        className={classes.menuButtonRight}
        aria-label="nav"
        onClick={() => props.onClickRight('right', false)}
      >
        <Link to={props.to}>
          <NavigateNextIcon />
        </Link>
      </IconButton>
    );
  }

  return (
    <div className={classes.root}>
      <Toolbar>
        {navButtonBefore}
        <Typography variant="h6">{props.title}</Typography>
        {navButtonNext}
      </Toolbar>
    </div>
  );
}
