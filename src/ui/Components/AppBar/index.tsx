import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import NetworkSelector from '../NetworkSelector';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';
import AddressList from '../AddressList';
import SettingsIcon from '@material-ui/icons/Settings';
import PageNav from '../PageNav';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    drawerInner: {
      width: 320,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      display: 'flex',
      color: 'inherit',
      padding: 16,
      'font-size': 16,
      'align-items': 'center',
      'margin-top': 10,
      'border-top': '1px solid #ccc',
    },
    linkText: {
      marginLeft: 3,
    },
    icon: {
      width: 20,
      height: 20,
    },
  }),
);

interface AppProps {
  handleNetworkChange: Function;
}

export default function (props: AppProps) {
  const classes = useStyles();

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
          <IconButton
            onClick={toggleDrawer('right', true)}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            data-testid="setting-icon"
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
            <div className={classes.drawerInner}>
              <PageNav to="#" position="right" onClickRight={setState} title="My Addresses" />

              <AddressList onSelectAddress={setState} />

              <Link to="/setting" onClick={toggleDrawer('right', false)} className={classes.link}>
                <SettingsIcon className={classes.icon} />
                <span className={classes.linkText}>Setting</span>
              </Link>
            </div>
          </Drawer>
        </Toolbar>
      </AppBar>
    </div>
  );
}
