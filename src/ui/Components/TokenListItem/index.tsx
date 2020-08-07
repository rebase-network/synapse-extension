import React from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  ListItem,
  ListItemText,
  Tooltip,
  //   ListItem,
  //   ListItemText,
  //   List,
  Link,
  //   Tooltip,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HelpOutline } from '@material-ui/icons';
import { shannonToCKBFormatter } from '@utils/formatters';
import CallMadeIcon from '@material-ui/icons/CallMade';

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
  type: any;
  txHash: string;
  index: string;
  outputdata: string;
}

interface AppProps {
  tokenInfo: ITokenInfo;
  explorerUrl: any;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    tokenInfo: {
      name,
      udt,
      ckb,
      decimal = '8',
      symbol = '',
      typeHash,
      txHash,
      index,
      outputdata,
      type,
    },
    explorerUrl,
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
      //   displayName = <Link to="/manage-udts">{typeHash.substr(0, 10)}</Link>;
      displayName = <div>{typeHash.substr(0, 10)}</div>;
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
  }
  const decimalInt = parseInt(decimal, 10);
  const ckbStr = ckb.toString();

  const handleListItemClick = (event, typeHashParmas: string) => {
    history.push(`/manage-udts/${typeHashParmas}`);
  };

  const handleClick = async (
    event,
    nameParams,
    typeHashParams,
    txHashParams,
    indexParams,
    outputdataParams,
  ) => {
    // const { args, codeHash, hashType } = type;
    history.push(
      `/send-tx?name=${nameParams}&typeHash=${typeHashParams}&txHash=${txHashParams}&index=${indexParams}&outputdata=${outputdataParams}`,
    );
  };

  return (
    <div>
      <ListItem
        button
        key={`item-${typeHash}`}
        onClick={(event) => handleListItemClick(event, typeHash)}
      >
        <ListItemText primary={displayName} />
        {expoloreShow}
        <ListItemText
          primary={`${udt / 10 ** decimalInt} ${symbol}`}
          secondary={`${shannonToCKBFormatter(ckbStr)} CKB`}
          className={classes.token}
        />
      </ListItem>
      <div>
        <Button
          type="submit"
          id="submit-button"
          color="primary"
          variant="contained"
          data-testid="submit-button"
          onClick={(event) => handleClick(event, name, typeHash, txHash, index, outputdata)}
        >
          <FormattedMessage id="Send" />
        </Button>
      </div>
    </div>
  );
};
