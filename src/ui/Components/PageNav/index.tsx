import React from 'react';
import { Link, useHistory } from 'react-router-dom';
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
      marginRight: theme.spacing(1),
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
  title: React.ReactNode;
  position?: string;
  onClickRight?: Function;
}

export default function PageNav(props: AppProps) {
  const classes = useStyles();
  const history = useHistory();
  let navButtonBefore;
  let navButtonNext;
  if (props.position !== 'right') {
    navButtonBefore = (
      <Link to={props.to}>
        <IconButton edge="start" className={classes.menuButton} aria-label="nav">
          <NavigateBeforeIcon />
        </IconButton>
      </Link>
    );
  } else {
    navButtonNext = (
      <IconButton
        edge="start"
        className={classes.menuButtonRight}
        aria-label="nav"
        onClick={() => {
          props.onClickRight('right', false);
          history.push(props.to);
        }}
      >
        <NavigateNextIcon />
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
