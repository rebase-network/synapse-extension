import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { ListItem, ListItemText, List, Link, Tooltip } from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { shannonToCKBFormatter } from '@utils/formatters';
import Modal from '@ui/Components/Modal';
import TxDetail from '@ui/Components/TxDetail';
import _ from 'lodash';

const useStyles = makeStyles({
  list: {
    cursor: 'pointer',
  },
});

interface AppProps {
  txList: any;
  explorerUrl: string;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedTxHash, setSelectedTxHash] = React.useState('');

  const { txList, explorerUrl } = props;

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

  const txListElem = txList.map((item) => (
    <List onClick={() => onSelectTx(item.hash)} key={item.hash} className={classes.list}>
      <Divider />
      <ListItem disableGutters>
        <ListItemText primary={`${shannonToCKBFormatter(item.amount.toString())} CKB`} />
        {item.typeHash !== null ? <ListItemText primary={item.sudt} /> : null}
        <Link rel="noreferrer" target="_blank" href={`${explorerUrl}/transaction/${item.hash}`}>
          <Tooltip title={<FormattedMessage id="View on Explorer" />} placement="top">
            <CallMadeIcon />
          </Tooltip>
        </Link>
      </ListItem>
      <ListItem disableGutters>
        <ListItemText secondary={item.income ? 'Received' : 'Sent'} />
        <ListItemText secondary={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
      </ListItem>
      <Modal open={open && selectedTxHash === item.hash} onClose={closeModal}>
        <TxDetail data={item} />
      </Modal>
    </List>
  ));

  return <div data-testid="container">{txListElem}</div>;
};
