import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ListItem, ListItemText, List, Link, Tooltip } from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { createStyles, withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { EXPLORER_URL } from '../../../utils/constants';
import Modal from '../Modal';
import TxDetail from '../TxDetail';
import { shannonToCKBFormatter } from '../../../utils/formatters';

const useStyles = makeStyles({
  list: {
    cursor: 'pointer',
  },
});

interface AppProps {
  txList: any;
}

export default function (props: AppProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedTxHash, setSelectedTxHash] = React.useState('');

  const toggleModal = () => {
    setOpen(!open);
  };

  const closeModal = () => {
    setSelectedTxHash('');
  };

  const onSelectTx = (hash) => {
    toggleModal();
    setSelectedTxHash(hash);
  };

  const txListElem = props.txList.map((item) => (
    <List onClick={() => onSelectTx(item.hash)} key={item.hash} className={classes.list}>
      <Divider />
      <ListItem>
        <ListItemText primary={`${shannonToCKBFormatter(item.amount.toString())} CKB`} />
        <Link rel="noreferrer" target="_blank" href={`${EXPLORER_URL}/transaction/${item.hash}`}>
          <Tooltip title="View on Explorer" placement="top">
            <CallMadeIcon />
          </Tooltip>
        </Link>
      </ListItem>
      <ListItem>
        <ListItemText secondary={item.income ? `Received` : `Sent`} />
        <ListItemText secondary={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
      </ListItem>
      <Modal open={open && selectedTxHash === item.hash} onClose={closeModal}>
        <TxDetail data={item} />
      </Modal>
    </List>
  ));

  return <div>{txListElem}</div>;
}
