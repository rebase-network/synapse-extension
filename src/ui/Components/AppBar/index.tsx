import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import NetworkSelector from '../NetworkSelector';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { Link } from "react-router-dom";
import MyAddresses from '../MyAddresses';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface AppProps { handleNetworkChange: Function }

interface AppState { }

export default function (props: AppProps) {
  const classes = useStyles();

  const menuClick = () => {

  }

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  type Anchor = 'top' | 'left' | 'bottom' | 'right';
  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Synapse
          </Typography>
          <NetworkSelector handleNetworkChange={props.handleNetworkChange} />
          <IconButton onClick={toggleDrawer("right", true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" data-testid="setting-icon">
            <MenuIcon />
          </IconButton>
          <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
              <MyAddresses/>
          </Drawer>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
