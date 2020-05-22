import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ListItem, ListItemText, List, Link, Tooltip } from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { createStyles, withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { EXPLORER_URL } from '../../../utils/constants';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    textAlign: 'center',
  },
  dialogTitle: {
    textAlign: 'right',
  },
  dialogContent: {
    padding: '0 16px 24px',
    textAlign: 'center',
    minWidth: 200,
  },
  address: {
    marginTop: 16,
    fontSize: 12,
    'word-break': 'break-all',
  },
  loading: {
    width: 200,
    padding: 24,
    textAlign: 'center',
  },
  tip: {
    marginBottom: 24,
    color: 'green',
  },
});

interface AppProps {
  txList: any;
}

export default function (props: AppProps) {
  const onTxDetail = () => {
    return;
  };

  const txListElem = props.txList.map((item) => (
    <List onClick={onTxDetail}>
      <Divider />
      <ListItem>
        <ListItemText primary={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />

        <Link rel="noreferrer" target="_blank" href={EXPLORER_URL + item.hash}>
          <Tooltip title="View on Explorer" placement="top">
            <CallMadeIcon />
          </Tooltip>
        </Link>
      </ListItem>
      <ListItem>
        <ListItemText secondary={`${item.amount / 10 ** 8} CKB`} />
        <ListItemText secondary={item.income ? `Received` : `Send`} />
      </ListItem>
    </List>
  ));

  return txListElem;
}
