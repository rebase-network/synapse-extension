import React from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ListItem, ListItemText, Tooltip, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HelpOutline } from '@material-ui/icons';
import { shannonToCKBFormatter } from '@utils/formatters';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
  token: {
    'text-align': 'right',
  },
  ckbFull: {
    display: 'flex',
    'align-items': 'center',
  },
  ckbFullText: {
    'margin-right': 8,
  },
  helpIcon: {
    'font-size': '1.2rem',
    color: 'gray',
  },
});

export interface ITokenInfo {
  name: string;
  udt: number;
  ckb: number;
  decimal: string;
  symbol: string;
  typeHash: string;
}

interface AppProps {
  tokenInfo: ITokenInfo;
  explorerUrl: any;
  sendLink: any;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    tokenInfo: { name, udt, ckb, decimal = '8', symbol = '', typeHash },
    explorerUrl,
    sendLink,
  } = props;
  let displayName: any = name;
  let expoloreShow: any = null;

  if (!name) {
    if (typeHash === 'null' || typeHash === null) {
      displayName = (
        <Tooltip
          title={<FormattedMessage id="CKB with data inside, it's not UDT" />}
          arrow
          placement="top"
        >
          <div className={classes.ckbFull}>
            <span className={classes.ckbFullText}>CKB (Full)</span>
            <HelpOutline className={classes.helpIcon} />
          </div>
        </Tooltip>
      );
    } else {
      displayName = <RouterLink to={`/manage-udts/${typeHash}`}>
        {typeHash.substr(0, 10)}
      </RouterLink>
      expoloreShow = (
        <Link rel="noreferrer" target="_blank" href={`${explorerUrl}/sudt/${typeHash}`}>
          <Tooltip title={<FormattedMessage id="View on Explorer" />} placement="top">
            <CallMadeIcon />
          </Tooltip>
        </Link>
      );
    }
  } else {
    expoloreShow = (
      <Link rel="noreferrer" target="_blank" href={`${explorerUrl}/sudt/${typeHash}`}>
        <Tooltip title={<FormattedMessage id="View on Explorer" />} placement="top">
          <CallMadeIcon />
        </Tooltip>
      </Link>
    );
    displayName = <RouterLink to={`/manage-udts/${typeHash}`}>
      {displayName}
    </RouterLink>
  }
  const decimalInt = parseInt(decimal, 10);
  const ckbStr = ckb.toString();

  const handleListItemClick = (event, typeHashParmas: string) => {
    history.push(`/manage-udts/${typeHashParmas}`);
  };

  return (
    <div>
      <ListItem
        disableGutters
        key={`item-${typeHash}`}
      >
        <ListItemText
          primary={displayName}
          secondary={sendLink}
        />
        {expoloreShow}
        <ListItemText
          primary={`${udt / 10 ** decimalInt} ${symbol}`}
          secondary={`${shannonToCKBFormatter(ckbStr)} CKB`}
          className={classes.token}
        />
      </ListItem>
    </div>
  );
};
