import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles({
  paper: {
    background: 'white',
    height: '100%',
  },
});

export default function SimpleModal(props: any) {
  const { children, open, onClose } = props;
  const classes = useStyles();
  const body = <div className={classes.paper}>{children}</div>;

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
